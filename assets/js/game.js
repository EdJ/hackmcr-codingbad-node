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
    },{
        src: 'images/suitcase.png',
        id: 'suitcase'
    }];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
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

    stage.addChild(avatar.asset);

    entities.push(avatar);

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

function init() {
    stage = new createjs.Stage("travelatorCanvas");
    setupGame(stage);

    setupLeaderBoard();

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
