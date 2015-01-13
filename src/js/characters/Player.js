var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');

Player.prototype = BaseCharacter;
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

    this.coins = 0;
    this.hp = 100;
    this.mp = 100;

    this.inventory = [];
    this.journal = new Journal(game);

    this.journal.add_quest(new Quest('test', 'this is a description', 100, null, 'here is a bunch of text added to the journal'));
    this.journal.add_quest(new Quest('test', 'this is a description', 100, null, 'more text added to journal'));
    this.journal.add_quest(new Quest('test', 'this is a description', 100, null, 'yet more'));
    this.journal.add_quest(new Quest('test', 'this is a description', 100, null, 'this is the newest entry'));
    this.journal.get_journal();
}

module.exports = Player;
