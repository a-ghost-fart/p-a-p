var Player = require('../characters/Player');

module.exports = {
    'create': function () {
        'use strict';
        this.player = new Player(this.game);
    },
    'update': function () {
        'use strict';
    },
    'render': function () {
        'use strict';
    }
};
