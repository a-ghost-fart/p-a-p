var BaseCharacter = require('./BaseCharacter');
var Quest = require('../quest/Quest');

Player.prototype = BaseCharacter;
Player.prototype.constructor = Player;

function Player() {
    'use strict';
    BaseCharacter.call(this);

    this.inventory = [];
    this.quests = {
        'completed': [],
        'failed': [],
        'open': []
    };
    this.quests.open.push(new Quest('test quest', 'this is a test quest, duh', 200));
}

module.exports = Player;
