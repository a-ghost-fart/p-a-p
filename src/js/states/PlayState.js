/*globals illuminated*/
var Player = require('../characters/Player');
var Item = require('../items/Item');
var Projectile = require('../projectiles/Projectile');

// Illuminated.js mapping
var Lamp = illuminated.Lamp;
var Rect = illuminated.RectangleObject;
var Lighting = illuminated.Lighting;
var DarkMask = illuminated.DarkMask;
var Vec2 = illuminated.Vec2;

// TODO: Refactor all this shit
module.exports = {
    'create': function () {
        'use strict';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.init_world();
        this.init_collections(this.game);
        this.init_player();
        this.collision_tile = 179;

        this.dust_emitter = this.game.add.emitter(0, 0, 100);
        this.dust_emitter.makeParticles('dust');
        this.dust_emitter.gravity = 200;

        // Lighting WIP
        this.blocks = this.consolidate_blocks();
        this.light = new Lamp({
            'position': new Vec2(100, 100),
            'diffuse': 0.4,
            'distance': 250,
            'color': 'rgba(255, 200, 200, 0.6)'
        });
        this.lighting = new Lighting({
            'light': this.light,
            'objects': this.blocks
        });
        this.darkmask = new DarkMask({
            'lights': [this.light],
            'color': 'rgba(0, 0, 0, 0.7)'
        });
        // end Lighting WIP
    },

    'consolidate_blocks': function () {
        'use strict';
        var blocks = [];
        var block_indices = [];

        var col_data = this.world.collision_layer.layer.data;
        var _this = this;

        for (var y = 0; y < col_data.length; y++) {
            for (var x = 0; x < col_data[0].length; x++) {
                if (col_data[y][x].index === this.collision_tile) {
                    var start = x;
                    var end = x;
                    block_indices.push({
                        'start': start,
                        'end': end,
                        'y': y
                    });
                    x = end;
                }
            }
        }

        block_indices.forEach(function (obj) {
            var topleft = new Vec2(col_data[obj.y][obj.start].worldX, col_data[obj.y][obj.start].worldY);
            var bottomright = new Vec2(col_data[obj.y][obj.end].worldX + 32, col_data[obj.y][obj.end].worldY + 32);
            var block = new Rect({ 'topleft': topleft, 'bottomright': bottomright });
            block.default_points = block.points;
            blocks.push(block);
        });

        function find_block_end(arr, current) {
            for (var i = current; i <= arr.length; i++) {
                if (i + 1 < arr.length) {
                    if (arr[i + 1].index !== _this.collision_tile) {
                        return i;
                    }
                } else {
                    return i;
                }
            }
        }

        return blocks;
    },

    'init_player': function () {
        'use strict';
        this.player = new Player(this.game, 10, 10);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_LOCKON);
    },

    'init_world': function () {
        'use strict';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'test_bg');
        background.fixedToCamera = true;

        this.game.world.setBounds(0, 0, 1120, 800);

        // Import and set up tilemaps   
        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tiles');

        this.world.layer = this.world.map.createLayer('derp');
        this.world.layer.resizeWorld();

        this.world.collision_layer = this.world.map.createLayer('collision');
        this.world.map.setCollision(179, true, this.world.collision_layer);
        this.world.collision_layer.resizeWorld();
    },

    'init_collections': function (game) {
        'use strict';

        // Debug test icon
        var item = new Item(this.game, 300, 300, {
            'name': 'test item',
            'description': 'something something',
            'stats': {},
            'type': 2,
            'weight': 0.0
        });
        this.collectables = this.game.add.group();
        this.collectables.enableBody = true;
        this.collectables.add(item);
    },

    'update': function () {
        'use strict';
        var _this = this;

        // Handle collisions
        this.game.physics.arcade.collide(this.player, this.world.collision_layer);
        this.game.physics.arcade.collide(this.collectables, this.world.collision_layer);
        this.game.physics.arcade.collide(this.dust_emitter, this.world.collision_layer);
        this.game.physics.arcade.collide(this.player.projectiles, this.world.collision_layer, function (projectile) {
            _this.dust_emitter.x = projectile.x;
            _this.dust_emitter.y = projectile.y;
            _this.dust_emitter.start(true, 2000, null, 10);
            projectile.kill();
        });
        this.game.physics.arcade.overlap(this.player, this.collectables, function (player, interactable) {
            player.inventory.add(interactable);
            interactable.destroy();
        });

        // Lighting WIP
        this.light.position.x = this.player.position.x - this.game.camera.view.x;
        this.light.position.y = this.player.position.y - this.game.camera.view.y;

        // This has been doing my head in. Basically in illuminatedjs
        // you need to change the actual vertices of the opaque blocks
        // manually (of course rebuilding the entire points so js doesn't
        // go crazy modifying values it shouldn't) and then shift them
        // around based on phaser's camera offset. Nice.
        this.blocks.forEach(function (block) {
            var points = [];
            for (var i = 0; i < block.points.length; i++) {
                var new_point = new Vec2(block.default_points[i].x - _this.game.camera.view.x, block.default_points[i].y - _this.game.camera.view.y);
                points.push(new_point);
            }
            block.points = points;
        });

        this.darkmask.compute(this.game.canvas.width, this.game.canvas.height);
        this.lighting.compute(this.game.canvas.width, this.game.canvas.height);
        // end Lighting WIP

        this.player.handle_update(this.game);
    },

    'render': function () {
        'use strict';
        // Lighting WIP
        this.lighting.render(this.game.context);
        this.darkmask.render(this.game.context);
        // end Lighting WIP
    }
};
