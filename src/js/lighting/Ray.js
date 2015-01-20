function Ray(start, target) {
    'use strict';
    this.start = start;
    this.target = target;
}

Ray.prototype.draw = function (context) {
    'use strict';
    var d_y = this.start.y - this.target.y;
    var d_x = this.start.x - this.target.x;
    var angle = Math.atan2(d_y, d_x);
    var dist = 1000;
    context.strokeStyle = 'green';
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.start.x - dist * Math.cos(angle), this.start.y - dist * Math.sin(angle));
    context.stroke();
};

module.exports = Ray;
