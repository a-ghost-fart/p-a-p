var ItemUtil = require('../util/ItemUtil');

function Item(name, description, stats, weight) {
    'use strict';
    this.name = name;
    this.description = description;
    this.stats = stats;
    this.weight = weight;
    this.id = ItemUtil.generate_item_id(name);
}

module.exports = Item;
