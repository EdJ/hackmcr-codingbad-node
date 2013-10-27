var Entity = function Entity() {
    this._velocity = new Vector();

    this._acceleration = new Vector();

    this._position = new Vector();
    this._maxVelocity = new Vector(100, 100);
    this._maxAcceleration = new Vector(10, 10);
    this._dimensions = new Vector();
};

Entity.prototype.setVelocity = function(newVelocity) {
    this._velocity = newVelocity;
};

Entity.prototype.setMaxVelocity = function(maxVelocity) {
    this._maxVelocity = maxVelocity;
};

Entity.prototype.setAcceleration = function(newAcceleration) {
    this._acceleration = newAcceleration;
};

Entity.prototype.setMaxAcceleration = function(newMaxAcceleration) {
    this._maxAcceleration = newMaxAcceleration;
};

Entity.prototype.setPosition = function(newPosition) {
    this._position = newPosition;
};

Entity.prototype.setDimensions = function(newDimensions) {
    this._dimensions = newDimensions;
};

Entity.prototype.update = function() {

    this._position.add(this._velocity.multiply(scale).multiply(fpsHandler.frameComplete));

    this.asset.x = this._position.x;
    this.asset.y = this._position.y;

    this._acceleration.cap(this._maxAcceleration);
    this._velocity.add(this._acceleration.multiply(fpsHandler.frameComplete)).cap(this._maxVelocity);
};

Entity.prototype.startScrolling = function() {
    this._oldUpdate = this.update;

    this.update = function() {
        this._oldUpdate();

        if (this._position.x < -this._dimensions.x) {
            this._position.x += this._dimensions.x;
        }
    };
};

Entity.prototype.stopScrolling = function() {
    this.update = this._oldUpdate;
};
