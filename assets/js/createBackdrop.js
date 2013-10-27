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