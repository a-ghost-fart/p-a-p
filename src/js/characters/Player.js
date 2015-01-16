var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');
var PlayerArms = require('./PlayerArms');

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'idle_anim', 5);

    this.animations.add('walk');
    this.animations.play('walk', 12, true);

    this.movement_speed = 250;
    this.jump_speed = 350;
    this.acceleration = 40;

    this.coins = 0;
    this.hp = 100;
    this.mp = 100;
    this.xp = 0;
    this.stats = {
        'endurance': null,
        'power': null,
        'speed': null,
        'psi': null
    };

    this.arms = new PlayerArms(game, x, y);
    //this.addChild(this.arms);

    this.inventory = new Inventory(12);
    this.journal = new Journal();
    this.abilities = [];

    this.enable_physics(game);
}

Player.prototype.enable_physics = function (game) {
    'use strict';
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.gravity.y = 450;
    this.anchor.setTo(0.5, 0.5);
    this.body.collideWorldBounds = true;
};

Player.prototype.handle_update = function (game) {
    'use strict';
    this.body.velocity.x = 0;
    this.angle = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.velocity.x = -this.movement_speed;
        this.angle = -6;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.velocity.x = this.movement_speed;
        this.angle = 6;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.body.onFloor()) {
        this.body.velocity.y = -this.jump_speed;
    }
}

module.exports = Player;
