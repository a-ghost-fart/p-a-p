var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');

Player.prototype = new BaseCharacter();
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

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

    this.sprite = game.add.sprite(32, 32, 'test');
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.bounce.y = 0.2;
    this.sprite.body.gravity.y = 300;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.inventory = new Inventory(12);
    this.journal = new Journal();
    this.abilities = [];
}

module.exports = Player;
