var stage;
var loader;
var canvas;
var viewport;
var loader;

var randomBetween = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

var plane = {};
var planes = [];
var ground = {};
var entities = [];

var groundLevel = 0;

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

Entity.prototype.setPosition = function(newPosition) {
    this._position = newPosition;
};

Entity.prototype.setDimensions = function(newDimensions) {
    this._dimensions = newDimensions;
};

Entity.prototype.update = function() {
    this._position.add(this._velocity.multiply(fpsHandler.frameComplete));

    this.asset.x = this._position.x;
    this.asset.y = this._position.y;

    this._velocity.add(this._acceleration).cap(this._maxVelocity);
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
    }, {
        src: 'images/bloke.png',
        id: 'avatar'
    }, {
        src: 'images/background.png',
        id: 'background'
    }];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
};

var createPlane = function() {
    var plane = new Entity();

    var asset = plane.asset = new createjs.Bitmap(loader.getResult('plane'));
    asset.setTransform(0, 0, 0.2, 0.2);

    stage.addChild(asset);

    var x = randomBetween(1, viewport.dimensions.x);

    plane.setPosition(new Vector(x, viewport.dimensions.y));

    var xVel = randomBetween(-20, 20);
    var yVel = randomBetween(-4, 4);

    plane.setVelocity(new Vector(-0.3, -0.1));
    plane.setMaxVelocity(new Vector(xVel, yVel));
    plane.setAcceleration(new Vector(-0.002, -0.002));

    planes.push(plane);
    entities.push(plane);

    return plane;
};

var createGround = function() {
    var ground = new Entity();
    var groundImage = loader.getResult("ground");

    groundLevel = viewport.dimensions.y - (groundImage.height * 0.8);

    var asset = ground.asset = new createjs.Shape();
    asset.graphics.beginBitmapFill(groundImage).drawRect(0, 0, viewport.dimensions.x + groundImage.width, groundImage.height);

    ground.setDimensions(new Vector(groundImage.width, groundImage.height));
    ground.setPosition(new Vector(0, viewport.dimensions.y - groundImage.height));
    ground.setVelocity(new Vector(-4, 0));
    ground.startScrolling();

    stage.addChild(asset);

    entities.push(ground);

    return ground;
};

var createAvatar = function() {
    var avatar = new Entity();
    var avatarImage = {
        width: 40,
        height: 61
    };

    var data = new createjs.SpriteSheet({
        "images": [loader.getResult("avatar")],
        "frames": {
            "regX": 0,
            "height": avatarImage.height,
            "count": 16,
            "regY": 0,
            "width": avatarImage.width
        },
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
            "run": [8, 11, "run", 1.5]
        }
    });

    avatar.asset = new createjs.Sprite(data, "run");
    avatar.asset.setTransform(0, 0, 0.8, 0.8);
    avatar.asset.framerate = fpsHandler.fps;

    avatar.setDimensions(new Vector(avatarImage.width, avatarImage.height));
    avatar.setPosition(new Vector(100, groundLevel - avatarImage.height));

    stage.addChild(avatar.asset);

    entities.push(avatar);

    return avatar;
};


function createBackground() {

    var background = new Entity();
    var backgroundImage = loader.getResult("background");

    var asset = background.asset = new createjs.Shape();
    asset.graphics.beginBitmapFill(backgroundImage).drawRect(0, 0, viewport.dimensions.x + backgroundImage.width, backgroundImage.height);

    background.setDimensions(new Vector(backgroundImage.width, backgroundImage.height));
    background.setPosition(new Vector(0, groundLevel - backgroundImage.height - 16));
    background.setVelocity(new Vector(-4, 0));
    background.startScrolling();

    stage.addChild(asset);

    entities.push(background);

    return background;
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

    for (var i = entities.length; i--;) {
        entities[i].update();
    }

    stage.update(event);
};

var attachInput = function(gameActions) {
    var mouseInput = function(gameActions) {
        stage.addEventListener('stagemousedown', gameActions.resetPlane);
    };

    var pressed = {};

    var keyboardInput = function(gameActions) {
        var handleInput = function() {
            if (pressed[32]) {
                gameActions.resetPlane();
            }
        };

        document.onkeydown = function(e) {
            e = e || window.event;

            pressed[e.keyCode] = true;

            handleInput();
        };

        document.onkeyup = function(e) {
            e = e || window.event;

            pressed[e.keyCode] = false;

            handleInput();
        };
    };

    var chimput = function(gameActions) {
        createjs.Ticker.addEventListener('tick', function() {
            if (Math.random() > 0.99) {
                gameActions.resetPlane();
            }
        });
    };

    mouseInput(gameActions);
    keyboardInput(gameActions);
    chimput(gameActions);
};

var gameActions = {
    resetPlane: function() {
        plane.setPosition(new Vector(viewport.dimensions.x - 100, viewport.dimensions.y));
    }
};

var playerId;
var socket;

var connect = function() {
    socket = io.connect('/');
    socket.on('player', function(data) {
        playerId = data.id;
        console.log(JSON.stringify(data));
    });
};

var gameOver = function(score) {
    socket.emit('score', {
        id: playerId,
        score: score
    });
};

var leaderboard = {
    connect: connect,
    gameOver: gameOver
};

function init() {

    leaderboard.connect();

    stage = new createjs.Stage("travelatorCanvas");
    setupGame(stage);

    var leaderboardStage = new createjs.Stage("leaderBoard");

    leaderboardStage.mouseEventsEnabled = true;
    var rect = new createjs.Shape();
    rect.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 40);
    leaderboardStage.addChild(rect);

    rect.addEventListener("click", function() {
        var playerScore = Math.floor((Math.random() * 1000));
        leaderboard.gameOver(playerScore);
    });
    //Update stage will render next frame  

    leaderboardStage.update();



    loadAssets(function() {
        var square = new createjs.Shape();

        square.graphics.beginFill("#8fb0d8").drawRect(0, 0, viewport.dimensions.x, viewport.dimensions.y);

        stage.addChild(square);


        var numberOfPlanes = randomBetween(1, 10);

        for (var i = numberOfPlanes; i--;) {
            createPlane();
        }

        ground = createGround();
        background = createBackground();
        
        createAvatar();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        attachInput(gameActions);

        createjs.Ticker.addEventListener('tick', onTick);
    });
}
