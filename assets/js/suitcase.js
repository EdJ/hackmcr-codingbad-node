var startSuitcaseSpawner = function() {
    var lastOffset = 0;
    for (var i = 10; i--;) {
        lastOffset = createSuitcase(lastOffset);
    }
};

var createSuitcase = function(lastOffset) {
    var suitcase = new Entity();

    var suitcaseType = randomBetween(1, 3);
    var suitcaseImage = loader.getResult('suitcase' + suitcaseType);
    var asset = suitcase.asset = new createjs.Bitmap(suitcaseImage);
    var yPos = groundLevel - (suitcaseImage.height * 0.5 * scale);
    asset.setTransform(0, 0, 0.5 * scale, 0.5 * scale);

    var newOffset = randomBetween(500, 3000);

    suitcase.setPosition(new Vector(viewport.dimensions.x + lastOffset + newOffset, yPos));
    suitcase.setVelocity(new Vector(gameSettings.groundSpeed + (randomBetween(1, 3) - 2), 0));
    suitcase.startScrolling();

    stage.addChild(asset);

    obstacles.push(suitcase);

    entities.push(suitcase);

    return newOffset;
};
