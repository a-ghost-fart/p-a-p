PlayerArms.prototype = Object.create(Phaser.Sprite.prototype);
PlayerArms.prototype.constructor = PlayerArms;

function PlayerArms(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'test_arms');
    this.anchor.setTo(0.5, 0.5);
}

module.exports = PlayerArms;
