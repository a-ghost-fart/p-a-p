var Player = require('../characters/Player');

module.exports = {
    'create': function () {
        'use strict';
        if (!this.game.events) {
            this.game.events = {};
        }

        this.player = new Player(this.game);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },
    'update': function () {
        'use strict';
    },
    'render': function () {
        'use strict';
    }
};
