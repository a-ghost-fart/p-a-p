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
