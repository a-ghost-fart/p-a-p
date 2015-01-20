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
