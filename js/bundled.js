(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function BaseCharacter() {
    'use strict';
}

BaseCharacter.prototype.update = function () {

};

BaseCharacter.prototype.render = function () {

};

module.exports = BaseCharacter;

},{}],2:[function(require,module,exports){
var BaseCharacter = require('./BaseCharacter');
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');

Player.prototype = new BaseCharacter();
Player.prototype.constructor = Player;

function Player(game) {
    'use strict';
    BaseCharacter.call(this);

    this.coins = 0;
    this.hp = 100;
    this.mp = 100;
    this.xp = 0;
    this.stats = {
        'endurance': null,
        'power': null,
        'speed': null,
        'psi': null
    };

    this.sprite = game.add.sprite(32, 32, 'test');
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.bounce.y = 0.2;
    this.sprite.body.gravity.y = 300;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.inventory = new Inventory(12);
    this.journal = new Journal();
    this.abilities = [];
}

module.exports = Player;

},{"../items/Inventory":5,"../quest/Journal":6,"../quest/Quest":7,"./BaseCharacter":1}],3:[function(require,module,exports){
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
        Phaser.AUTO
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};


},{"./conf/Config.js":3,"./states/LoadingState":8,"./states/PlayState":9}],5:[function(require,module,exports){
function Inventory(size) {
    'use strict';
    // Yeah, correct the size for 0 indexing
    this.size = size - 1;
    this.items = new Array(size - 1);
    this.weight = 0.0;
    this._item_buffer = undefined;
}

Inventory.prototype.drop = function (slot) {
    'use strict';
    if (!slot) {
        throw new Error('No slot defined, cannot drop item.');
    }
    var item = this.items[slot];
    this.items[slot] = undefined;
    return item;
};


Inventory.prototype.add = function (item, slot) {
    'use strict';
    if (!item) {
        throw new Error('Cannot add item to inventory as no item supplied.');
    }
    if (!slot) {
        var s = this.find_empty_slot();
        if (s !== null) {
            this.items[s] = item;
        } else {
            console.log('No free slot found, inventory full!');
        }
    } else {
        if (slot > this.size) {
            throw new Error('Attempted to add item to slot ' + slot + ' but that is beyond the inventory size.');
        }
        if (this.items[slot] !== undefined) {
            throw new Error('Cannot add item to slot ' + slot + ' as there is already an item there.');
        } else {
            this.items[slot] = item;
        }
    }
};


Inventory.prototype.find_empty_slot = function () {
    'use strict';
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] === undefined) {
            return i;
        }
    }
    return null;
};


Inventory.prototype.list = function () {
    'use strict';
    console.log(this.items);
};


module.exports = Inventory;

},{}],6:[function(require,module,exports){
var Quest = require('./Quest');

function Journal() {
    'use strict';
    this.quests = {
        'open': [],
        'failed': [],
        'completed': []
    };
    this.journal = [];
}


Journal.prototype.add_entry = function (text) {
    'use strict';
    this.journal.push(text);
};


Journal.prototype.get_journal = function () {
    'use strict';
    for (var i = this.journal.length - 1; i >= 0; i--) {
        console.log(this.journal[i]);
    }
};


Journal.prototype.add_quest = function (quest) {
    'use strict';
    if (quest.journal_entry !== null) {
        this.add_entry(quest.journal_entry);
    }
    this.quests.open.push(quest);
};


Journal.prototype.find_quest_index_by_id = function (id) {
    'use strict';
    var index = null;
    for (var i = 0; i < this.quests.open.length; i++) {
        if (this.quests.open[i].id === id) {
            index = i;
        }
    }
    return index;
};


Journal.prototype.complete_quest = function (id) {
    'use strict';
    if (!id) {
        throw new Error('You must supply an id for a quest to complete.');
    }
    var index = this.find_quest_index_by_id(id);
    if (index === null) {
        throw new Error('Cannot complete quest with id "' + id + '" as it is not found.');
    }
    this.quests.open[index].complete();
    this.quests.completed.push(this.quests.open[index]);
    this.quests.open.splice(index, 1);
};


Journal.prototype.fail_quest = function (id) {
    'use strict';
    if (!id) {
        throw new Error('You must supply an id for a quest to fail.');
    }
    var index = this.find_quest_index_by_id(id);
    if (index === null) {
        throw new Error('Cannot fail quest with id "' + id + '" as it is not found.');
    }
    this.quests.open[index].fail();
    this.quests.failed.push(this.quests.open[index]);
    this.quests.open.splice(index, 1);
};


module.exports = Journal;

},{"./Quest":7}],7:[function(require,module,exports){
var QuestUtil = require('../util/QuestUtil');

function Quest(name, description, xp_reward, item_reward, journal_entry) {
    'use strict';
    this.name = name;
    this.description = description;
    this.xp_reward = xp_reward;
    this.item_reward = item_reward
        ? item_reward
        : null;
    this.journal_entry = journal_entry
        ? journal_entry
        : null;
    this.id = QuestUtil.generate_quest_id(this.name);
}

Quest.prototype.complete = function () {
    'use strict';
    console.log('completed quest: ', this);
};

Quest.prototype.fail = function () {
    'use strict';
    console.log('failed quest: ', this);
};

module.exports = Quest;

},{"../util/QuestUtil":10}],8:[function(require,module,exports){
module.exports = {
    'preload': function () {
        'use strict';
        this.load.image('test', 'assets/sprites/test_player.png');
        this.load.image('test_bg', 'assets/backgrounds/test_galaxy.jpg');
        this.load.image('test_tiles', 'assets/tilesets/test_tileset.png');

        this.load.tilemap('test_map', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};

},{}],9:[function(require,module,exports){
var Player = require('../characters/Player');

module.exports = {
    'create': function () {
        'use strict';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'test_bg');
        background.fixedToCamera = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1120, 800);

        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tiles');
        this.world.map.setCollision(4);
        this.world.layer = this.world.map.createLayer('derp');

        this.player = new Player(this.game);

        this.game.camera.follow(this.player.sprite, Phaser.Camera.STYLE_TOPDOWN);

        this.entities = [];
        this.entities.push(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    'update': function () {
        'use strict';
        this.entities.forEach(function (entity) {
            entity.update();
        });

        this.game.physics.arcade.collide(this.player.sprite, this.world.layer);

        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.angle = 0;

        if (this.cursors.left.isDown) {
            this.player.sprite.body.velocity.x = -150;
            this.player.sprite.angle = -10;
        }
        if (this.cursors.right.isDown) {
            this.player.sprite.body.velocity.x = 150;
            this.player.sprite.angle = 10;
        }
        if (this.cursors.up.isDown && this.player.sprite.body.onFloor()) {
            this.player.sprite.body.velocity.y = -350;
        }
    },
    'render': function () {
        'use strict';
        this.entities.forEach(function (entity) {
            entity.render();
        });
    }
};

},{"../characters/Player":2}],10:[function(require,module,exports){
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