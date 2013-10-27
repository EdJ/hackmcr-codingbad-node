var createAsset = function(imageName, getassetCoords, velocity, acceleration, itemScale) {
    itemScale = itemScale || 1;

    var graphicalAsset = new Entity();

    var asset = graphicalAsset.asset = new createjs.Bitmap(loader.getResult(imageName));
    asset.setTransform(0, 0, scale * itemScale, scale * itemScale);

    stage.addChild(asset);

    var reset = function (toReset) {
        console.log(toReset);
        toReset.setPosition(getassetCoords());

        toReset.setVelocity(velocity);
        toReset.setMaxVelocity(new Vector(20, 0));
        toReset.setAcceleration(acceleration);
    };

    reset(graphicalAsset);

    graphicalAsset._oldUpdate = graphicalAsset.update;

    graphicalAsset.update = function () {
        this._oldUpdate();

        if (this._position.x < -400) {
            reset(this);
        }
    };

    entities.push(graphicalAsset);

    return graphicalAsset;
};
