var stage;
var loader;
var canvas;
var viewport;
var loader;

var plane = {};
var ground = {};

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

Vector.prototype.multiply = function(by) {
    return new Vector(this.x * by, this.y * by);
};

var Entity = function Entity() {
    this._velocity = new Vector();

    this._acceleration = new Vector();

    this._position = new Vector();
    this._maxVelocity = new Vector(100, 100);
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

Entity.prototype.setPosition = function(newPosition) {
    this._position = newPosition;
};

Entity.prototype.update = function() {
    this._position.add(this._velocity.multiply(fpsHandler.frameComplete));

    this.asset.x = this._position.x;
    this.asset.y = this._position.y;

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
        }, {
            src: 'images/ground.png',
            id: 'ground'
        }

    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
};

var createPlane = function() {
    var plane = new Entity();

    var asset = plane.asset = new createjs.Bitmap(loader.getResult('plane'));
    asset.setTransform(0, 0, 0.2, 0.2);

    stage.addChild(asset);

    plane.setPosition(new Vector(viewport.dimensions.x - 100, viewport.dimensions.y));

    plane.setVelocity(new Vector(-0.3, -0.1));
    plane.setMaxVelocity(new Vector(-20, -5));
    plane.setAcceleration(new Vector(-0.002, -0.002));

    return plane;
};

var createGround = function() {
    var ground = new Entity();
    var groundImage = loader.getResult("ground");

    var asset = ground.asset = new createjs.Shape();
    asset.graphics.beginBitmapFill(groundImage).drawRect(0, 0, viewport.dimensions.x, groundImage.height);

    //asset.y = viewport.dimensions.y - groundImage.height;
    ground.setPosition(new Vector(0, viewport.dimensions.y - groundImage.height));
    ground.setVelocity(new Vector(-0.4, 0));
    stage.addChild(asset);

    return ground;
};

var fpsHandler = {
    fps: 10,
    lastRender: 0,
    calculateChange: function(event) {
        if (!this.numTicks) {
            this.numTicks = 1000 / this.fps;
        }

        var currentTick = createjs.Ticker.getTime();

        var diff = currentTick - this.lastRender;

        this.frameComplete = (diff - this.lastDiff) / this.numTicks;
        if (this.frameComplete < 0) {
            this.frameComplete = 1 + this.frameComplete;
        }

        this.lastDiff = diff;

        if (diff > this.numTicks) {
            this.lastRender = currentTick;

            return true;
        }

        return false;
    },
    frameComplete: 0,
    lastDiff: 0
};

var onTick = function(event) {
    fpsHandler.calculateChange();
    plane.update();
    ground.update();

    stage.update(event);
};

var attachInput = function (gameActions) {
    var mouseInput = function(gameActions) {
        stage.addEventListener('stagemousedown', gameActions.resetPlane);
    };

    var pressed = {};

    var keyboardInput = function (gameActions) {
        var handleInput = function () {
            if (pressed[32]) {
                gameActions.resetPlane();
            }
        };

        document.onkeydown = function (e) {
            e = e || window.event;

            pressed[e.keyCode] = true;

            handleInput();
        };

        document.onkeyup = function (e) {
            e = e || window.event;

            pressed[e.keyCode] = false;

            handleInput();
        };
    };

    var chimput = function (gameActions) {
        createjs.Ticker.addEventListener('tick', function () {
            if (Math.random() > 0.9) {
                gameActions.resetPlane();
            }
        });
    };

    mouseInput(gameActions);
    keyboardInput(gameActions);
};

var gameActions = {
    resetPlane: function () {
        plane.setPosition(new Vector(viewport.dimensions.x - 100, viewport.dimensions.y));
    }
};

function init() {
    stage = new createjs.Stage("travelatorCanvas");
    setupGame(stage);

    loadAssets(function() {

        var square = new createjs.Shape();

        square.graphics.beginFill("#000000").drawRect(0, 0, viewport.dimensions.x, viewport.dimensions.y);

        stage.addChild(square);

        plane = createPlane();

        ground = createGround();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        attachInput(gameActions);

        createjs.Ticker.addEventListener('tick', onTick);
    });
}
