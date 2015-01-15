var ItemUtil = require('../util/ItemUtil');

function Item(name, description, stats, type, weight) {
    'use strict';
    this.name = name;
    this.description = description;
    this.stats = stats;
    this.weight = weight;
    this.type = type;
    this.id = ItemUtil.generate_item_id(name);
}

module.exports = Item;
