var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');

Player.prototype = BaseCharacter;
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

    this.coins = 0;
    this.hp = 100;
    this.mp = 100;
    this.xp = 0;

    this.inventory = new Inventory(12);
    this.journal = new Journal();
}

module.exports = Player;
