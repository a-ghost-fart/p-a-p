module.exports = {
    'preload': function () {
        'use strict';
        this.load.image('test', 'assets/sprites/test_player.png');
    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};
