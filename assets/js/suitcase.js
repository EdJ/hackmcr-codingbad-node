var createSuitcase = function() {
    var suitcase = new Entity();

    var asset = suitcase.asset = new createjs.Bitmap(loader.getResult('suitcase'));
    asset.setTransform(0, 0, scale, scale);

    suitcase.setPosition(new Vector(viewport.dimensions.x, 200)); 
    suitcase.setVelocity(new Vector(-4, 0));
    suitcase.startScrolling();

    stage.addChild(asset);

    var getSuitcaseCoords = function () {
        var xOffset = randomBetween(100, viewport.dimensions.x-100);
        var y = -800;

        var x = xOffset;

        return new Vector(x, y);
    };

   

    entities.push(suitcase);

    return suitcase;
};