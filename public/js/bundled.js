(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function BaseCharacter() {
    'use strict';
}

module.exports = BaseCharacter;

},{}],2:[function(require,module,exports){
var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');

Player.prototype = BaseCharacter;
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

    this.inventory = [];
    this.journal = new Journal(game);

    game.events.add_quest.dispatch(new Quest('test test', 'derp', 200));
}

module.exports = Player;

},{"../quest/Journal":5,"../quest/Quest":6,"./BaseCharacter":1}],3:[function(require,module,exports){
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


},{"./conf/Config.js":3,"./states/LoadingState":7,"./states/PlayState":8}],5:[function(require,module,exports){
var Quest = require('./Quest');

function Journal(game) {
    'use strict';
    this.quests = {
        'open': [],
        'failed': [],
        'completed': []
    };
    this.init_events(game);
}


Journal.prototype.init_events = function (game) {
    'use strict';
    game.events.complete_quest = new Phaser.Signal();
    game.events.complete_quest.add(this.complete_quest.bind(this));
    game.events.fail_quest = new Phaser.Signal();
    game.events.fail_quest.add(this.fail_quest.bind(this));
    game.events.add_quest = new Phaser.Signal();
    game.events.add_quest.add(this.add_quest.bind(this));
};


Journal.prototype.add_quest = function (quest) {
    'use strict';
    this.quests.open[quest.id] = quest;
};


Journal.prototype.complete_quest = function (id) {
    'use strict';
    if (!id) {
        throw new Error('You must supply an id for a quest to complete.');
    }
    if (!this.quests.open[id]) {
        throw new Error('Cannot complete quest with id "' + id + '" as it is not found.');
    }
    this.quests.completed.push(this.quests.open[id]);
    delete this.quests.open[id];
};


Journal.prototype.fail_quest = function (id) {
    'use strict';
    if (!id) {
        throw new Error('You must supply an id for a quest to fail.');
    }
    if (!this.quests.open[id]) {
        throw new Error('Cannot fail quest with id "' + id + '" as it is not found.');
    }
    this.quests.failed.push(this.quests.open[id]);
    delete this.quests.open[id];
};


module.exports = Journal;

},{"./Quest":6}],6:[function(require,module,exports){
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

},{"../util/QuestUtil":9}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../characters/Player":2}],9:[function(require,module,exports){
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