var stage;
var loader;
var canvas;
var viewport;

var endGame;

var randomBetween = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

var entities = [];
var obstacles = [];

var scale = 1;

var groundLevel = 0;

var playerScore = 0;
var actualScore;
var score = 0;
var setupGame = function(stage) {
    canvas = stage.canvas;

    var expectedWidth = 1280;
    var expectedHeight = 320;

    scale = ((100 / 1280) * window.innerWidth) / 100;

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
    }, {
        src: 'images/securityBloke.png',
        id: 'securityBloke'
    }, {
        src: 'images/suitcase1.png',
        id: 'suitcase1'
    }, {
        src: 'images/suitcase2.png',
        id: 'suitcase2'
    }, {
        src: 'images/suitcase3.png',
        id: 'suitcase3'
    }];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest);
};

var playBackgroundMusic = function() {
   Sound.play("background");
};


var createGround = function() {
    var ground = new Entity();
    var groundImage = loader.getResult("ground");

    var preScale = 1 / (((100 / (viewport.dimensions.y / 7)) * groundImage.height) / 100);

    groundLevel = viewport.dimensions.y - (groundImage.height * preScale);

    var asset = ground.asset = new createjs.Shape();
    var matrix = new createjs.Matrix2D();
    matrix.scale(preScale, preScale);

    asset.graphics.beginBitmapFill(groundImage, 'repeat', matrix).drawRect(0, 0, viewport.dimensions.x + (groundImage.width * preScale), groundImage.height * preScale);

    ground.setDimensions(new Vector(groundImage.width, groundImage.height).multiply(preScale));
    ground.setPosition(new Vector(0, viewport.dimensions.y - (groundImage.height * preScale)));
    ground.setVelocity(new Vector(gameSettings.groundSpeed, 0));
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

    avatar.asset = new createjs.BitmapAnimation(data);
    avatar.asset.gotoAndPlay("run");
    avatar.asset.framerate = fpsHandler.fps;
    avatar.asset.scaleX = avatar.asset.scaleY = scale;

    avatar.setDimensions(new Vector(avatarImage.width * scale, avatarImage.height * scale));
    avatar.setPosition(new Vector(viewport.dimensions.x / 5, groundLevel - (avatarImage.height * scale)));

    avatar._firstUpdate = avatar.update;
    avatar.update = function() {
        this._firstUpdate();

        var obstacle;
        for (var i = obstacles.length; i--;) {
            obstacle = obstacles[i];

            var isColliding = ndgmr.checkPixelCollision(obstacle.asset, this.asset, 0.75, true);

            if (isColliding) {
                endGame();
            }
        }
    };

    avatar.originalX = avatar._position.x;

    avatar.jump = function() {
        if (this._jumping || this._position.x - this.originalX > (viewport.dimensions.x / 5)) {
            return;
        }

        if (this._oldUpdate) {
            this.update = this._oldUpdate;
        }

        this._jumping = true;
        avatar.setAcceleration(new Vector(0.15, -gameSettings.jumpAccel));

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

                if (this._position.x > this.originalX) {
                    return;
                }

                this._position.x = this.originalX;
                this._acceleration.x = 0;
                this._velocity.x = 0;

                this.update = this._oldUpdate;
            };
        };
    }

    stage.addChild(avatar.asset);

    entities.push(avatar);

    gameActions.jump = function() {
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
    avatar.asset.framerate = fpsHandler.fps;
    avatar.asset.scaleX = avatar.asset.scaleY = scale;

    avatar.setDimensions(new Vector(avatarImage.width, avatarImage.height).multiply(scale));
    avatar.setPosition(new Vector(viewport.dimensions.x / 10, groundLevel - (avatarImage.height * scale)));

    stage.addChild(avatar.asset);

    entities.push(avatar);

    return avatar;
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

var addScoreBoard = function() {
    var scoreTitle = new createjs.Text("Score : ", "15px Arial Bold", "#000");
    scoreTitle.y = 7;
    scoreTitle.x = 7;

    stage.addChild(scoreTitle);
};

var updateScore = function() {
    var playerScore = createjs.Ticker.getTime() / 100;
    if (playerScore % 5 < 1) {
        score += 5;
    }

    stage.removeChild(actualScore);

    actualScore = new createjs.Text(score, "18px Arial Bold", "Red");
    actualScore.y = 5;
    actualScore.x = 60;

    stage.addChild(actualScore);
};

var stopUpdating = false;

endGame = function() {
    stopUpdating = true;
    Sound.play("explosion");    
    leaderboard.gameOver(score);

    $("#leaderBoard").css('visibility', 'visible');

    if ($.QueryString.chimput) {
        setTimeout(function() { location.reload(); }, 5000);
    }
};

var onTick = function(event) {
    if (stopUpdating) {
        return;
    }

    fpsHandler.calculateChange();

    for (var i = entities.length; i--;) {
        entities[i].update();
    }

    updateScore();

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
            if (Math.random() > 0.995) {
                $("a#showLeaderboard").click();
            }
        });
    };

    mouseInput(gameActions);
    keyboardInput(gameActions);

    if ($.QueryString.chimput) {
        chimput(gameActions);
    }
};

var gameActions = {};

function init() {
    if ($.QueryString.chimput) {
        localStorage.playerName = "Chimput";
    }

    stage = new createjs.Stage("travelatorCanvas");

    setupGame(stage);

    setupLeaderBoard();

    loadAssets(function() {
        var square = new createjs.Shape();
        square.graphics.beginFill("#8fb0d8").drawRect(0, 0, viewport.dimensions.x, viewport.dimensions.y);


        stage.addChild(square);

        createBackdrop();

        createPlane();

        playBackgroundMusic();

        createGround();

        createBackground();

        startSuitcaseSpawner();

        createAvatar();

        createSecurityAvatar();

        addScoreBoard();

        showStartBanner();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;

        attachInput(gameActions);

        createjs.Ticker.addEventListener('tick', onTick);
    });
}
