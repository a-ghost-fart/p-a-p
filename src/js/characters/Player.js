var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');
var PlayerArms = require('./PlayerArms');

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'base_player');

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

module.exports = Player;
