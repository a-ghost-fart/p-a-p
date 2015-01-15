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
