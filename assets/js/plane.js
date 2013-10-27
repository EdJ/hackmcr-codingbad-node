var createPlane = function(assetName, itemScale, velocity) {	
    var getPlaneCoords = function () {
    	Sound.play('aeroplane');
        var yOffset = randomBetween(-30, 30);

        var y = (viewport.dimensions.y / 2) + yOffset;

        var x = viewport.dimensions.x + randomBetween(40, 90);

        return new Vector(x, y);
    };

    return createAsset(assetName, getPlaneCoords, velocity, new Vector(-0.2, 0), itemScale);
};
