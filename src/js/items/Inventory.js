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


Inventory.prototype.init_ui = function (game) {
    'use strict';
    var button = game.add.button(10, 10, 'test_button', this.list, this, 2, 1, 0);
    button.fixedToCamera = true;
};


Inventory.prototype.list = function () {
    'use strict';
    console.log(this.items);
};


module.exports = Inventory;
