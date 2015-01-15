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
}

module.exports = Item;
