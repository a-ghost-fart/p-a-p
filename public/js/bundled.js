(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Journal = require('../quest/Journal');
var Quest = require('../quest/Quest');
var Inventory = require('../items/Inventory');
var PlayerArms = require('./PlayerArms');

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'idle_anim', 5);

    this.animations.add('walk');
    this.animations.play('walk', 12, true);

    this.movement_speed = 250;
    this.jump_speed = 350;
    this.acceleration = 40;

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

    this.arms = new PlayerArms(game, x, y);
    //this.addChild(this.arms);

    this.inventory = new Inventory(12);
    this.journal = new Journal();
    this.abilities = [];

    this.enable_physics(game);

    // Bullet mock
    this.projectiles = game.add.group();
    this.projectiles.enableBody = true;
    this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectiles.createMultiple(50, 'test_projectile');
    this.projectiles.setAll('checkWorldBounds', true);
    this.projectiles.setAll('outOfBoundsKill', true);
    this.fire_cooldown = 0;
    this.fire_rate = 100;
}

Player.prototype.enable_physics = function (game) {
    'use strict';
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.gravity.y = 450;
    this.anchor.setTo(0.5, 0.5);
    this.body.collideWorldBounds = true;
};

Player.prototype.fire = function (game, target) {
    'use strict';
    if (game.time.now > this.fire_cooldown && this.projectiles.countDead() > 0) {
        this.fire_cooldown = game.time.now + this.fire_rate;
        var projectile = this.projectiles.getFirstDead();
        projectile.reset(this.x, this.y);
        projectile.rotation = game.physics.arcade.angleToPointer(projectile);
        game.physics.arcade.moveToPointer(projectile, 300);
    }
};

Player.prototype.handle_update = function (game) {
    'use strict';
    this.body.velocity.x = 0;
    this.angle = 0;

    if (game.input.activePointer.isDown) {
        this.fire(game, game.input.mousePointer.position);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.velocity.x = -this.movement_speed;
        this.angle = -6;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.velocity.x = this.movement_speed;
        this.angle = 6;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.body.onFloor()) {
        this.body.velocity.y = -this.jump_speed;
    }
}

module.exports = Player;

},{"../items/Inventory":6,"../quest/Journal":12,"../quest/Quest":13,"./PlayerArms":2}],2:[function(require,module,exports){
PlayerArms.prototype = Object.create(Phaser.Sprite.prototype);
PlayerArms.prototype.constructor = PlayerArms;

function PlayerArms(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'test_arms');
    this.anchor.setTo(0.5, 0.5);
}

module.exports = PlayerArms;

},{}],3:[function(require,module,exports){
module.exports = {
    'TITLE': 'Something in phaser.',
    'VERSION': '0.0.1',
    'WIDTH': 800,
    'HEIGHT': 600
};

},{}],4:[function(require,module,exports){
module.exports = {
    'ARMOUR': 0,
    'WEAPON': 1,
    'SPELL': 2,
    'CONSUMABLE': 3
};

},{}],5:[function(require,module,exports){
var Config = require('./conf/Config.js');

// Bootstrap phaser and states
window.onload = function () {
    'use strict';
    document.title = Config.TITLE + ' v' + Config.VERSION;

    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.CANVAS
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};


},{"./conf/Config.js":3,"./states/LoadingState":14,"./states/PlayState":15}],6:[function(require,module,exports){
var ItemType = require('../enum/ItemType');

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


Inventory.prototype.use_item = function (slot) {
    'use strict';
    try {
        var item = this.get_item_in_slot(slot);
        if (item.type === ItemType.CONSUMABLE) {
            console.log('it\'s a consumable');
        } else if (item.type === ItemType.ARMOUR) {
            console.log('it\'s armour');
        } else if (item.type === ItemType.WEAPON) {
            console.log('it\'s a weapon');
        }
    } catch (e) {
        console.error(e);
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


Inventory.prototype.get_item_in_slot = function (slot) {
    'use strict';
    if (!this.items[slot]) {
        throw new Error('No item found in slot ' + slot);
    } else {
        return this.items[slot];
    }
};


Inventory.prototype.list = function () {
    'use strict';
    console.log(this.items);
};


module.exports = Inventory;

},{"../enum/ItemType":4}],7:[function(require,module,exports){
var ItemUtil = require('../util/ItemUtil');

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

function Item(game, x, y, item_props) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'test_item');
    this.name = item_props.name;
    this.description = item_props.description;
    this.stats = item_props.stats;
    this.weight = item_props.weight;
    this.type = item_props.type;

    this.enable_physics(game);
}

Item.prototype.enable_physics = function (game) {
    'use strict';
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0.5;
    this.body.gravity.y = 300;
    this.anchor.setTo(0.5, 0.5);
};

module.exports = Item;

},{"../util/ItemUtil":16}],8:[function(require,module,exports){
function Block(position, width, height) {
    'use strict';
    this.position = position;
    this.width = width;
    this.height = height;
}

Block.prototype.get_points = function () {
    'use strict';
    return [
        new Phaser.Point(this.position.x, this.position.y - this.height),
        new Phaser.Point(this.position.x + this.width, this.position.y - this.height),
        new Phaser.Point(this.position.x + this.width, this.position.y),
        new Phaser.Point(this.position.x, this.position.y)
    ];
};

Block.prototype.draw_outline = function (context) {
    'use strict';
    var points = this.get_points();
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.lineTo(points[0].x, points[0].y);
    context.stroke();
};

module.exports = Block;

},{}],9:[function(require,module,exports){
function Light(position) {
    'use strict';
    this.position = position;
}

Light.prototype.emit = function (context) {
    'use strict';
    context.fillStyle = 'blue';
    context.fillRect(this.position.x, this.position.y, 20, 20);
};

module.exports = Light;

},{}],10:[function(require,module,exports){
function Ray(start, target) {
    'use strict';
    this.start = start;
    this.target = target;
}

Ray.prototype.draw = function (context) {
    'use strict';
    var d_y = this.start.y - this.target.y;
    var d_x = this.start.x - this.target.x;
    var angle = Math.atan2(d_y, d_x);
    var dist = 1000;
    context.strokeStyle = 'green';
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.start.x - dist * Math.cos(angle), this.start.y - dist * Math.sin(angle));
    context.stroke();
};

module.exports = Ray;

},{}],11:[function(require,module,exports){
Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

function Projectile(game, x, y) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'test_projectile');
}


Projectile.prototype.fire = function (game, target) {
    'use strict';
    
};

module.exports = Projectile;

},{}],12:[function(require,module,exports){
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

},{"./Quest":13}],13:[function(require,module,exports){
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

},{"../util/QuestUtil":17}],14:[function(require,module,exports){
module.exports = {
    'preload': function () {
        'use strict';
        // Test assets
        this.load.image('test', 'assets/sprites/test_player.png');
        this.load.image('test_arms', 'assets/sprites/test_arms.png');
        this.load.image('test_bg', 'assets/backgrounds/test_galaxy.jpg');
        this.load.image('test_tiles', 'assets/tilesets/test_tileset.png');
        this.load.image('test_item', 'assets/sprites/test_item.png');
        this.load.image('test_projectile', 'assets/sprites/test_projectile.png');
        this.load.spritesheet('test_button', 'assets/ui/test_button.png', 64, 32);
        this.load.tilemap('test_map', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('base_player', 'assets/sprites/base_player.png');
        this.load.spritesheet('idle_anim', 'assets/sprites/idle_animation.png', 14, 48, 12);
        this.load.bitmapFont('bitmap_font', 'assets/ui/font.png', 'assets/ui/font.xml');
        this.load.image('dust', 'assets/sprites/dust.png');

    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};

},{}],15:[function(require,module,exports){
/*globals illuminated*/
var Player = require('../characters/Player');
var Item = require('../items/Item');
var Projectile = require('../projectiles/Projectile');

var Block = require('../lighting/Block');
var Light = require('../lighting/Light');
var Ray = require('../lighting/Ray');

// TODO: Refactor all this shit
module.exports = {
    'create': function () {
        'use strict';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.init_world();
        this.init_collections(this.game);
        this.init_player();

        this.dust_emitter = this.game.add.emitter(0, 0, 100);
        this.dust_emitter.makeParticles('dust');
        this.dust_emitter.gravity = 200;

        // WIP light stuff
        this.collision_tile = 179;
        this.lights = [];
        this.lights.push(new Light(new Phaser.Point(100, 100)));
        this.blocks = this.consolidate_blocks();
        // end WIP
    },

    'consolidate_blocks': function () {
        'use strict';
        var blocks = [];
        var block_indices = [];

        var col_data = this.world.collision_layer.layer.data;
        var _this = this;

        for (var y = 0; y < col_data.length; y++) {
            for (var x = 0; x < col_data[0].length; x++) {
                if (col_data[y][x].index === this.collision_tile) {
                    var start = x;
                    var end = find_block_end(col_data[y], x);
                    block_indices.push({
                        'start': start,
                        'end': end,
                        'y': y
                    });
                    x = end;
                }
            }
        }

        block_indices.forEach(function (obj) {
            blocks.push(
                new Block(
                    new Phaser.Point(col_data[obj.y][obj.start].worldX, col_data[obj.y][obj.start].worldY + 32),
                    (obj.end - obj.start + 1) * 32,
                    32
                )
            );
        });

        function find_block_end(arr, current) {
            for (var i = current; i <= arr.length; i++) {
                if (i + 1 < arr.length) {
                    if (arr[i + 1].index !== _this.collision_tile) {
                        return i;
                    }
                } else {
                    return i;
                }
            }
        }

        return blocks;
    },

    'init_player': function () {
        'use strict';
        this.player = new Player(this.game, 10, 10);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);
    },

    'init_world': function () {
        'use strict';
        var background = this.game.add.tileSprite(0, 0, 800, 600, 'test_bg');
        background.fixedToCamera = true;

        this.game.world.setBounds(0, 0, 1120, 800);

        // Import and set up tilemaps   
        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tiles');

        this.world.layer = this.world.map.createLayer('derp');
        this.world.layer.resizeWorld();

        this.world.collision_layer = this.world.map.createLayer('collision');
        this.world.map.setCollision(179, true, this.world.collision_layer);
        this.world.collision_layer.resizeWorld();
    },

    'init_collections': function (game) {
        'use strict';

        // Debug test icon
        var item = new Item(this.game, 300, 300, {
            'name': 'test item',
            'description': 'something something',
            'stats': {},
            'type': 2,
            'weight': 0.0
        });
        this.collectables = this.game.add.group();
        this.collectables.enableBody = true;
        this.collectables.add(item);
    },

    'update': function () {
        'use strict';
        var _this = this;

        // Handle collisions
        this.game.physics.arcade.collide(this.player, this.world.collision_layer);
        this.game.physics.arcade.collide(this.collectables, this.world.collision_layer);
        this.game.physics.arcade.collide(this.dust_emitter, this.world.collision_layer);
        this.game.physics.arcade.collide(this.player.projectiles, this.world.collision_layer, function (projectile) {
            _this.dust_emitter.x = projectile.x;
            _this.dust_emitter.y = projectile.y;
            _this.dust_emitter.start(true, 2000, null, 10);
            projectile.kill();
        });
        this.game.physics.arcade.overlap(this.player, this.collectables, function (player, interactable) {
            player.inventory.add(interactable);
            interactable.destroy();
        });

        // WIP light stuff
        this.lights[0].position.x = this.player.position.x;
        this.lights[0].position.y = this.player.position.y;
        // end WIP

        this.player.handle_update(this.game);
    },

    'render': function () {
        'use strict';

        // WIP light stuff
        var _this = this;
        this.lights.forEach(function (light) {
            _this.blocks.forEach(function (block) {
                block.draw_outline(_this.game.context);
                var points = block.get_points();
                points.forEach(function (point) {
                    var ray = new Ray(light.position, point);
                    ray.draw(_this.game.context);
                });
            });
        });
        // end WIP
    }
};

},{"../characters/Player":1,"../items/Item":7,"../lighting/Block":8,"../lighting/Light":9,"../lighting/Ray":10,"../projectiles/Projectile":11}],16:[function(require,module,exports){
module.exports = {
    'generate_item_id': function (seed) {
        'use strict';
        var id = 'i-';
        for (var i = 0; i < seed.length; i++) {
            id += seed.charCodeAt(i).toString(16);
        }
        id += '-' + (Math.random(seed) * 999999999).toFixed(0).toString(16);
        return id;
    }
};

},{}],17:[function(require,module,exports){
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

},{}]},{},[5])