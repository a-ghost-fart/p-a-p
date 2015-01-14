var Player = require('../characters/Player');

module.exports = {
    'create': function () {
        'use strict';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'test_bg');
        background.fixedToCamera = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1120, 800);

        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tiles');
        this.world.map.setCollision(4);
        this.world.layer = this.world.map.createLayer('derp');

        this.player = new Player(this.game);

        this.game.camera.follow(this.player.sprite, Phaser.Camera.STYLE_TOPDOWN);

        this.entities = [];
        this.entities.push(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    'update': function () {
        'use strict';
        this.entities.forEach(function (entity) {
            entity.update();
        });

        this.game.physics.arcade.collide(this.player.sprite, this.world.layer);

        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.angle = 0;

        if (this.cursors.left.isDown) {
            this.player.sprite.body.velocity.x = -150;
            this.player.sprite.angle = -10;
        }
        if (this.cursors.right.isDown) {
            this.player.sprite.body.velocity.x = 150;
            this.player.sprite.angle = 10;
        }
        if (this.cursors.up.isDown && this.player.sprite.body.onFloor()) {
            this.player.sprite.body.velocity.y = -350;
        }
    },
    'render': function () {
        'use strict';
        this.entities.forEach(function (entity) {
            entity.render();
        });
    }
};
