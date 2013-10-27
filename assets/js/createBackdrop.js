var createBackdrop = function(image, parallaxSpeed) {
    var backdrop = new Entity();
    var backdropImage = loader.getResult(image);

    var preScale = 1 / (((100 / groundLevel) * backdropImage.height) / 100);

    var asset = backdrop.asset = new createjs.Shape();
    var matrix = new createjs.Matrix2D
    matrix.scale(preScale, preScale);

    asset.graphics.beginBitmapFill(backdropImage, 'repeat', matrix).drawRect(0, 0, viewport.dimensions.x + (backdropImage.width * preScale), backdropImage.height * preScale);

    backdrop.setDimensions(new Vector(backdropImage.width, backdropImage.height).multiply(preScale));
    backdrop.setVelocity(new Vector(parallaxSpeed, 0));
    backdrop.startScrolling();

    stage.addChild(asset);

    entities.push(backdrop);

    return backdrop;
};