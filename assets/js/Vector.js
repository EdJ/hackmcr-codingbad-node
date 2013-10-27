
var Vector = function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.add = function(otherVector) {
    this.x += otherVector.x || 0;
    this.y += otherVector.y || 0;

    return this;
};

Vector.prototype.cap = function(capTo) {
    this.x = this.x > capTo.x ? capTo.x : this.x;
    this.y = this.y > capTo.y ? capTo.y : this.y;

    this.x = this.x < -capTo.x ? -capTo.x : this.x;
    this.y = this.y < -capTo.y ? -capTo.y : this.y;

    return this;
};

Vector.prototype.multiply = function(by) {
    return new Vector(this.x * by, this.y * by);
};