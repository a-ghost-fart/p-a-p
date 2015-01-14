var Config = require('./conf/Config.js');

// Bootstrap phaser and states
window.onload = function () {
    'use strict';
    document.title = Config.TITLE + ' v' + Config.VERSION;

    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.AUTO
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};

