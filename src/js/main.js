var Config = require('./conf/Config.js');
var LoadingState = require('./states/LoadingState.js');

window.onload = function () {
    'use strict';
    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.AUTO,
        document.body,
        LoadingState,
        false
    );
};

