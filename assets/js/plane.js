var createPlane = function() {	
    var getPlaneCoords = function () {
        var yOffset = randomBetween(-30, 30);

        var y = (viewport.dimensions.y / 2) + yOffset;

        var x = viewport.dimensions.x + randomBetween(40, 90);

        return new Vector(x, y);
    };

    return createAsset('plane', getPlaneCoords, new Vector(-3, 0), new Vector(-0.2, 0));
};
