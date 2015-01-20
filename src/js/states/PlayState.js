/*globals illuminated*/
var Player = require('../characters/Player');
var Item = require('../items/Item');
var Projectile = require('../projectiles/Projectile');

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


        // Lighting hacks
        this.lamp = new illuminated.Lamp({ position: new illuminated.Vec2(100, 100) });
        this.poly = new illuminated.RectangleObject(new illuminated.Vec2(140, 140), new illuminated.Vec2(160, 160));
        this.lighting = new illuminated.Lighting({ light: this.lamp, objects: [this.poly]});
        this.darkmask = new illuminated.DarkMask({ lights: [this.lamp], color: 'rgba(0, 0, 0, 0.8)'});
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

        // Lighting hacks
        this.lamp.position.x = this.player.x;
        this.lamp.position.y = this.player.y;
        this.lighting.compute(this.game.canvas.width - this.game.camera._targetPosition.x, this.game.canvas.height - this.game.camera._targetPosition.y);
        this.darkmask.compute(this.game.canvas.width, this.game.canvas.height);

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

        this.player.handle_update(this.game);
    },

    'render': function () {
        'use strict';
        this.lighting.render(this.game.context);
        this.darkmask.render(this.game.context);
    }
};
