var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');

Player.prototype = BaseCharacter;
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

    this.inventory = [];
    this.journal = new Journal(game);

    game.events.add_quest.dispatch(new Quest('test test', 'derp', 200));
}

module.exports = Player;
