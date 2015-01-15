var Player = require('../characters/Player');
var Item = require('../items/Item');
var Projectile = require('../projectiles/Projectile');

// TODO: Refactor all this shit
module.exports = {
    'create': function () {
        'use strict';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'test_bg');
        background.fixedToCamera = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1120, 800);

        // Import and set up tilemaps   
        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tiles');

        this.world.layer = this.world.map.createLayer('derp');
        this.world.layer.resizeWorld();

        var item = new Item(this.game, 300, 300, {
            'name': 'test item',
            'description': 'something something',
            'stats': {},
            'type': 2,
            'weight': 0.0
        });
        this.interactables = this.game.add.group();
        this.interactables.enableBody = true;
        this.interactables.add(item);

        this.projectiles = this.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.projectiles.createMultiple(20, 'test_projectile', 0, false);
        this.projectiles.setAll('anchor.x', 0.5);
        this.projectiles.setAll('anchor.y', 0.5);
        this.projectiles.setAll('outOfBoundsKill', true);
        this.projectiles.setAll('checkWorldBounds', true);

        this.world.collision_layer = this.world.map.createLayer('collision');
        this.world.map.setCollision(179, true, this.world.collision_layer);
        this.world.collision_layer.resizeWorld();

        this.player = new Player(this.game, 10, 10);
        this.player.inventory.init_ui(this.game);
        this.game.add.existing(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);

        // Remove
        var bmpText = this.game.add.bitmapText(200, 100, 'bitmap_font', 'SOMETHING', 12);
        bmpText.fixedToCamera = true;
    },

    'update': function () {
        'use strict';
        // Collide with the collision layer
        this.game.physics.arcade.collide(this.player, this.world.collision_layer);
        this.game.physics.arcade.collide(this.interactables, this.world.collision_layer);
        this.game.physics.arcade.overlap(this.player, this.interactables, function (player, interactable) {
            player.inventory.add(interactable);
            interactable.destroy();
        });

        this.player.body.velocity.x = 0;
        this.player.angle = 0;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -150;
            this.player.angle = -10;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = 150;
            this.player.angle = 10;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.body.onFloor()) {
            this.player.body.velocity.y = -350;
        }

        if (this.game.input.activePointer === 1) {
            var bullet = this.projectiles.getFirstDead();
            bullet.reset(this.player.x, this.player.y);
            bullet.rotation = this.game.physics.arcade.moveToObject(this, this.game.input.activePointer, 500);
        };

    },

    'render': function () {
        'use strict';
    }
};
