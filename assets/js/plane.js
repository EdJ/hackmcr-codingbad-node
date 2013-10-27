
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
