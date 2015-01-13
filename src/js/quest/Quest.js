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
