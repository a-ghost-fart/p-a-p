var GeometryUtil = require('../util/GeometryUtil');

function Ray(start, target) {
    'use strict';
    this.start = start;
    this.distance = 1000;
    this.angle = Math.atan2(this.start.y - target.y, this.start.x - target.x);
    this.end = new Phaser.Point(
        this.start.x - this.distance * Math.cos(this.angle),
        this.start.y - this.distance * Math.sin(this.angle)
    );
}

Ray.prototype.draw = function (context) {
    'use strict';
    context.strokeStyle = 'green';
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
};

Ray.prototype.check_collision = function (blocks) {
    'use strict';
    var _this = this;

    blocks.forEach(function (block) {
        var edges = block.get_edges();
        for (var i = 0; i < edges.length; i++) {
            var intersect = GeometryUtil.get_intersect([_this.start, _this.end], edges[i]);
        }
    });
};

module.exports = Ray;
