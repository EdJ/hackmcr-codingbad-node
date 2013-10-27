

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
