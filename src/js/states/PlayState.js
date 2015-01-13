var Player = require('../characters/Player');

module.exports = {
    'create': function () {
        'use strict';
        this.player = new Player();

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },
    'update': function () {
        'use strict';
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            console.log('fart');
        }
    },
    'render': function () {
        'use strict';
    }
};
