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
