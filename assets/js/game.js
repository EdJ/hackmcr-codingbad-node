
var stage;
var loader;
var canvas;
var viewport;
var loader;

var plane = {};

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

    return this;
};

var Entity = function Entity() {
    this._velocity = new Vector();

    this._acceleration = new Vector();
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

Entity.prototype.update = function() {
    this.asset.x = this.asset.x + (this._velocity.x * fpsHandler.frameComplete);
    this.asset.y = this.asset.y + (this._velocity.y * fpsHandler.frameComplete);

    this._velocity.add(this._acceleration).cap(this._maxVelocity);
};

var setupGame = function(stage) {
    canvas = stage.canvas;

    canvas = document.getElementById("travelatorCanvas");
    viewport = {
        dimensions: {
            x: window.innerWidth,
            y: window.innerHeight
        }
    };

    canvas.width = viewport.dimensions.x - 5;
    canvas.height = viewport.dimensions.y - 5;
};

var loadAssets = function(handleComplete) {
    var manifest = [{
        src: 'images/plane2small.png',
        id: 'plane'
    }];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
};

var createPlane = function() {
    var plane = new Entity();

    var asset = plane.asset = new createjs.Bitmap(loader.getResult('plane'));
    asset.setTransform(viewport.dimensions.x - 100, viewport.dimensions.y, 0.2, 0.2);

    stage.addChild(asset);

    plane.setVelocity(new Vector(-0.3, -0.1));
    plane.setMaxVelocity(new Vector(-20, -5))
    plane.setAcceleration(new Vector(-0.002, -0.002));

    return plane;
};

var fpsHandler = {
    fps: 1,
    lastRender: 0,
    shouldUpdate: function(event) {
        if (!this.numTicks) {
            this.numTicks = 1000 / this.fps;
            this.perTickPercent = 100 / this.numTicks;
        }

        var currentTick = createjs.Ticker.getTime();

        var diff = currentTick - this.lastRender;
        this.frameComplete = ((this.perTickPercent * diff) / 100) - this.frameComplete;

        if (diff > this.numTicks) {
            this.lastRender = currentTick;

            return true;
        }

        return false;
    },
    frameComplete: 0
};

var onTick = function(event) {
    var shouldUpdate = fpsHandler.shouldUpdate();
    plane.update();

    stage.update(event);
};

function init() {
    stage = new createjs.Stage("travelatorCanvas");
    setupGame(stage);

    loadAssets(function() {
        var square = new createjs.Shape();

        square.graphics.beginFill("#000000").drawRect(0, 0, viewport.dimensions.x, viewport.dimensions.y);

        stage.addChild(square);

        plane = createPlane();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener('tick', onTick);
    });
}