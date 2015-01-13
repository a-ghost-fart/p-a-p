(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function BaseCharacter() {
    'use strict';
}

module.exports = BaseCharacter;

},{}],2:[function(require,module,exports){
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

},{"../quest/Quest":5,"./BaseCharacter":1}],3:[function(require,module,exports){
module.exports = {
    'WIDTH': 800,
    'HEIGHT': 600
};

},{}],4:[function(require,module,exports){
var Config = require('./conf/Config.js');

// Bootstrap phaser and states
window.onload = function () {
    'use strict';
    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.CANVAS
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};


},{"./conf/Config.js":3,"./states/LoadingState":6,"./states/PlayState":7}],5:[function(require,module,exports){
var QuestUtil = require('../util/QuestUtil');

function Quest(name, description, xp_reward, item_reward) {
    'use strict';
    this.name = name;
    this.description = description;
    this.xp_reward = xp_reward;
    this.item_reward = item_reward
        ? item_reward
        : null;
    this.id = QuestUtil.generate_quest_id(this.name);
}

Quest.prototype.complete = function () {
    'use strict';
};

Quest.prototype.fail = function () {
    'use strict';
};

module.exports = Quest;

},{"../util/QuestUtil":8}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"../characters/Player":2}],8:[function(require,module,exports){
module.exports = {
    'generate_quest_id': function (seed) {
        'use strict';
        var id = 'q-';
        for (var i = 0; i < seed.length; i++) {
            id += seed.charCodeAt(i).toString(16);
        }
        id += '-' + (Math.random(seed) * 999999999).toFixed(0).toString(16);
        return id;
    }
};

},{}]},{},[4])