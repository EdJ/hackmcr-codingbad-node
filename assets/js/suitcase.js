var suitcase = function() {
    var suitcase = new Entity();
    var suitcaseImage = {
        width: 40,
        height: 61
    };

    var data = new createjs.SpriteSheet({
        "images": [loader.getResult("suitcase")],
        "frames": {
            "regX": 0,
            "height": suitcaseImage.height,
            "count": 16,
            "regY": 0,
            "width": suitcaseImage.width
        },
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
            "run": [12, 15, "run", 0.5]
        }
    });

    suitcase.asset = new createjs.Sprite(data, "run");
    suitcase.asset.setTransform(0, 0, scale, scale);
    suitcase.asset.framerate = fpsHandler.fps;

    suitcase.setDimensions(new Vector(suitcaseImage.width, suitcaseImage.height));
    suitcase.setPosition(new Vector(100, groundLevel - suitcaseImage.height));

    stage.addChild(suitcase.asset);

    entities.push(suitcase);

    return suitcase;
};