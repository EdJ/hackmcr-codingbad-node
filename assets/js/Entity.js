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
    if (!this._originalX) {
        this._originalX = newPosition.x;
    }

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

Entity.prototype.jump = function() {
    if (this._jumping || this._position.x - this._originalX > (viewport.dimensions.x / 5)) {
        return;
    }

    if (this._oldUpdate) {
        this.update = this._oldUpdate;
    }

    this._jumping = true;
    this.setAcceleration(new Vector(0.15, -gameSettings.jumpAccel));

    if (this._velocity.x < 0) {
        this._velocity.x = 0;
    }

    this._oldUpdate = this.update;

    this._lowestY = groundLevel - this._dimensions.y;

    var gravity = gameSettings.gravity;

    this.update = function() {
        this._oldUpdate();

        this._acceleration.y += gravity * fpsHandler.frameComplete;
        if (this._position.y <= this._lowestY) {
            return;
        }

        this._acceleration.x = -0.5;
        this._acceleration.y = 0;
        this._velocity.y = 0;

        this._position.y = this._lowestY;

        this.update = function () {
            this._jumping = false;

            this._oldUpdate();

            if (this._position.x > this._originalX) {
                return;
            }

            this._position.x = this._originalX;
            this._acceleration.x = 0;
            this._velocity.x = 0;

            this.update = this._oldUpdate;
        };
    };
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
