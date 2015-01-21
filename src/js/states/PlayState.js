/*globals illuminated*/
var Player = require('../characters/Player');
var Item = require('../items/Item');
var Projectile = require('../projectiles/Projectile');

var Block = require('../lighting/Block');
var Light = require('../lighting/Light');
var Ray = require('../lighting/Ray');

// TODO: Refactor all this shit
module.exports = {
    'create': function () {
        'use strict';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.init_world();
        this.init_collections(this.game);
        this.init_player();

        this.dust_emitter = this.game.add.emitter(0, 0, 100);
        this.dust_emitter.makeParticles('dust');
        this.dust_emitter.gravity = 200;

        // WIP light stuff
        this.collision_tile = 179;
        this.lights = [];
        this.lights.push(new Light(new Phaser.Point(100, 100)));
        this.blocks = this.consolidate_blocks();
        // end WIP
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
                    var end = find_block_end(col_data[y], x);
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
            blocks.push(
                new Block(
                    new Phaser.Point(col_data[obj.y][obj.start].worldX, col_data[obj.y][obj.start].worldY + 32),
                    (obj.end - obj.start + 1) * 32,
                    32
                )
            );
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
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);
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

        // WIP light stuff
        this.lights[0].position.x = this.player.position.x;
        this.lights[0].position.y = this.player.position.y;
        // end WIP

        this.player.handle_update(this.game);
    },

    'render': function () {
        'use strict';

        // WIP light stuff
        var _this = this;
        this.lights.forEach(function (light) {
            _this.blocks.forEach(function (block) {
                block.draw_outline(_this.game.context);
                var points = block.get_points();
                points.forEach(function (point) {
                    var ray = new Ray(light.position, point);
                    ray.draw(_this.game.context);
                });
            });
        });
        // end WIP
    }
};
