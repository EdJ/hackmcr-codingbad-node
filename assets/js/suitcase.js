var startSuitcaseSpawner = function() {
    var coolingOffPeriodRemaining = 0;
    createjs.Ticker.addEventListener('tick', function() {
        coolingOffPeriodRemaining--;
        if ((Math.random() > (1-gameSettings.suitcaseSpawnProbability)) && (coolingOffPeriodRemaining < 0)) {
            createSuitcase();
            coolingOffPeriodRemaining = gameSettings.coolingOffPeriod;
        }
    });
};

var createSuitcase = function() {
    var suitcase = new Entity();

    var suitcaseType = randomBetween(1, 3);
    var suitcaseImage = loader.getResult('suitcase' + suitcaseType);
    var asset = suitcase.asset = new createjs.Bitmap(suitcaseImage);
    var xPos = groundLevel - (suitcaseImage.height * 0.5);
    asset.setTransform(0, 0, scale * 0.5, scale * 0.5);

    suitcase.setPosition(new Vector(viewport.dimensions.x, xPos));
    suitcase.setVelocity(new Vector(gameSettings.groundSpeed, 0));
    suitcase.startScrolling();

    stage.addChild(asset);

    obstacles.push(suitcase);

    entities.push(suitcase);

    return suitcase;
};
