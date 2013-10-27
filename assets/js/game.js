var stage;
var loader;
var canvas;
var viewport;
var loader;

var randomBetween = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

var entities = [];

var scale = 1;

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
    this._position.add(this._velocity.multiply(scale).multiply(fpsHandler.frameComplete));

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

    var expectedWidth = 1280;
    var expectedHeight = 320;

    scale = ((100 / 1280) * window.innerWidth) / 100;

    console.log(scale);

    canvas = document.getElementById("travelatorCanvas");
    viewport = {
        dimensions: {
            x: window.innerWidth,
            y: expectedHeight * scale
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
        src: 'images/background.PNG',
        id: 'background'
    }, {
        src: 'images/backdrop.jpg',
        id: 'backdrop'
    },{
        src: 'images/securityBloke.png',
        id: 'securityBloke'
    }];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
};

var createPlane = function() {
    var plane = new Entity();

    var asset = plane.asset = new createjs.Bitmap(loader.getResult('plane'));
    asset.setTransform(0, 0, scale, scale);

    stage.addChild(asset);

    var getPlaneCoords = function () {
        var yOffset = randomBetween(-30, 30);

        var y = (viewport.dimensions.y / 2) + yOffset;

        var x = viewport.dimensions.x + randomBetween(40, 90);

        return new Vector(x, y);
    };

    plane.setPosition(getPlaneCoords());

    plane.setVelocity(new Vector(-3, 0));
    plane.setMaxVelocity(new Vector(20, 0));
    plane.setAcceleration(new Vector(-0.2, 0));

    plane._oldUpdate = plane.update;

    plane.update = function () {
        this._oldUpdate();

        if (this._position.x < -400) {
            plane.setPosition(getPlaneCoords());
            plane.setVelocity(new Vector(-3, 0));
        }
    };

    entities.push(plane);

    return plane;
};

var createGround = function() {
    var ground = new Entity();
    var groundImage = loader.getResult("ground");


    var preScale = 1 / (((100 / (viewport.dimensions.y / 7)) * groundImage.height) / 100);

    groundLevel = viewport.dimensions.y - (groundImage.height * scale * preScale);

    var asset = ground.asset = new createjs.Shape();
    var matrix = new createjs.Matrix2D
    matrix.scale(preScale, preScale);

    asset.graphics.beginBitmapFill(groundImage, 'repeat', matrix).drawRect(0, 0, viewport.dimensions.x + groundImage.width, groundImage.height);
    asset.setTransform(0, 0, scale, scale);

    ground.setDimensions(new Vector(groundImage.width, groundImage.height).multiply(preScale));
    ground.setPosition(new Vector(0, viewport.dimensions.y - groundImage.height));
    ground.setVelocity(new Vector(-4, 0));
    ground.startScrolling();

    stage.addChild(asset);

    entities.push(ground);

    return ground;
};

var createAvatar = function() {
    avatar = new Entity();
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
            "run": [8, 11, "run", 0.5]
        }
    });

    avatar.asset = new createjs.Sprite(data, "run");
    avatar.asset.setTransform(0, 0, scale, scale);
    avatar.asset.framerate = fpsHandler.fps;

    avatar.setDimensions(new Vector(avatarImage.width, avatarImage.height));
    avatar.setPosition(new Vector(300, groundLevel - avatarImage.height));

    stage.addChild(avatar.asset);

    entities.push(avatar);

    return avatar;
};

var createSecurityAvatar = function() {
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
            "run": [12, 15, "run", 0.5]
        }
    });

    avatar.asset = new createjs.Sprite(data, "run");
    avatar.asset.setTransform(0, 0, scale, scale);
    avatar.asset.framerate = fpsHandler.fps;

    avatar.setDimensions(new Vector(avatarImage.width, avatarImage.height));
    avatar.setPosition(new Vector(100, groundLevel - avatarImage.height));

    avatar.jump = function () {
        if (this._jumping) {
            return;
        }

        this._jumping = true;
        avatar.setAcceleration(new Vector(0, -1.5));


        this._oldUpdate = this.update;

        this._lowestY = groundLevel - this._dimensions.y;

        this.update = function () {
            this._oldUpdate();

            this._acceleration.y += 0.098;
            if (this._position.y > this._lowestY) {
                this._acceleration.y = 0;
                this._velocity.y = 0;

                this._position.y = this._lowestY;

                this.update = this._oldUpdate;
                this._jumping = false;
            }
        };
    }

    stage.addChild(avatar.asset);

    entities.push(avatar);

    gameActions.jump = function () {
        avatar.jump();
    };

    return avatar;
};


var createBackground = function() {
    var background = new Entity();
    var backgroundImage = loader.getResult("background");

    var preScale = 1 / (((100 / groundLevel) * backgroundImage.height) / 100);

    var asset = background.asset = new createjs.Shape();
    var matrix = new createjs.Matrix2D
    matrix.scale(preScale, preScale);

    asset.graphics.beginBitmapFill(backgroundImage, 'repeat', matrix).drawRect(0, 0, viewport.dimensions.x + backgroundImage.width * preScale, backgroundImage.height * preScale);
    asset.setTransform(0, 0, scale, scale);

    background.setDimensions(new Vector(backgroundImage.width, backgroundImage.height).multiply(preScale));
    background.setVelocity(new Vector(-3, 0));
    background.startScrolling();

    stage.addChild(asset);

    entities.push(background);

    return background;
};

var createBackdrop = function() {
    var backdrop = new Entity();
    var backdropImage = loader.getResult("backdrop");

    var preScale = 1 / (((100 / viewport.dimensions.y) * backdropImage.height) / 100);

    var asset = backdrop.asset = new createjs.Shape();
    var matrix = new createjs.Matrix2D
    matrix.scale(preScale, preScale);

    asset.graphics.beginBitmapFill(backdropImage, 'repeat', matrix).drawRect(0, 0, viewport.dimensions.x + backdropImage.width, backdropImage.height);
    asset.setTransform(0, 0, scale, scale);

    backdrop.setDimensions(new Vector(backdropImage.width, backdropImage.height));
    backdrop.setVelocity(new Vector(-1, 0));
    backdrop.startScrolling();

    stage.addChild(asset);

    entities.push(backdrop);

    return backdrop;
};

var fpsHandler = {
    fps: 20,
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
        stage.addEventListener('stagemousedown', gameActions.jump);
    };

    var pressed = {};

    var keyboardInput = function(gameActions) {
        var handleInput = function() {
            if (pressed[32]) {
                gameActions.jump();
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
            if (Math.random() > 0.95) {
                gameActions.jump();
            }
        });
    };

    mouseInput(gameActions);
    keyboardInput(gameActions);
    chimput(gameActions);
};

var gameActions = {};

var playerId;
var socket;
var playerScores;
var leaderboardStage;
var scoreTextEntities = [];

var connect = function() {
    socket = io.connect('/');
    socket.on('player', function(data) {
        playerId = localStorage.getItem('playerId') || data.id;
        localStorage.setItem('playerId', playerId);
        console.log(JSON.stringify(data));
        
        for (var i = 0; i <= scoreTextEntities.length; i++) {
            leaderboardStage.removeChild(scoreTextEntities[i])
        }

        for (var i = 0; i <= data.leaderBoard.length; i++) {
            var title = new createjs.Text(i+1, "18px Arial", "#6C5D75");
            title.y = 80 + (20*i);
            title.x = 15;
            leaderboardStage.addChild(title);
            scoreTextEntities.push(title);
            var title = new createjs.Text(data.leaderBoard[i].id, "15px Arial", "#6C5D75");
            title.y = 80 + (20*i);
            title.x = 100;
            leaderboardStage.addChild(title);
            scoreTextEntities.push(title);
            var title = new createjs.Text(data.leaderBoard[i].score, "20px Times New Roman Bold", "#EC0000");
            title.y = 80 + (20*i);
            title.x = 400;
            leaderboardStage.addChild(title);
            scoreTextEntities.push(title);
            leaderboardStage.update();
        };
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

    leaderboardStage = new createjs.Stage("leaderBoard");

    leaderboardStage.mouseEventsEnabled = true;
    var rect = new createjs.Shape();
    rect.graphics.beginFill("#CECECE").drawRect(0, 0, 500, 700);

    var lbTitleBar = new createjs.Shape();
    lbTitleBar.graphics.beginFill("#211B1B").drawRect(0, 0, 500, 50);

    var lbsubTitleBar = new createjs.Shape();
    lbsubTitleBar.graphics.beginFill("#F25B15").drawRect(0, 50, 500, 30);

    var txt = new createjs.Text("Travelator Leaderboard", "17px Arial", "#FFF");
    txt.y = 15;
    txt.x = 15;

    var rankTitle = new createjs.Text("Rank", "15px Arial", "#DBD8E9");
    rankTitle.y = 55;
    rankTitle.x = 15;

    var playerTitle = new createjs.Text("Player Id", "15px Arial", "#DBD8E9");
    playerTitle.y = 55;
    playerTitle.x = 100;

    var scoreTitle = new createjs.Text("Score", "15px Arial", "#DBD8E9");
    scoreTitle.y = 55;
    scoreTitle.x = 400;

    leaderboardStage.addChild(rect);
    leaderboardStage.addChild(lbTitleBar);
    leaderboardStage.addChild(lbsubTitleBar)
    leaderboardStage.addChild(txt);
    leaderboardStage.addChild(rankTitle);
    leaderboardStage.addChild(playerTitle);
    leaderboardStage.addChild(scoreTitle);

    rect.addEventListener("click", function() {
        var playerScore = Math.floor((Math.random() * 1000));
        leaderboard.gameOver(playerScore)
    });

    leaderboardStage.update();

    loadAssets(function() {
        var square = new createjs.Shape();
        square.graphics.beginFill("#8fb0d8").drawRect(0, 0, viewport.dimensions.x, viewport.dimensions.y);

        stage.addChild(square);

        createBackdrop();

        createPlane();

        createGround();

        createBackground();

        createAvatar();

        createSecurityAvatar();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        attachInput(gameActions);

        createjs.Ticker.addEventListener('tick', onTick);
    });
}
