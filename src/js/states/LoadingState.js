module.exports = {
    'create': function () {
        'use strict';
        window.g.stage.backgroundColor = '#fff';
        window.g.load.image('test', 'assets/test_player.png');
        var player = window.g.add.sprite(32, 48, 'test');
    },
    'update': function () {

    }
};
