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
    console.log("Spawning suitcase type: " + suitcaseType);
    var asset = suitcase.asset = new createjs.Bitmap(loader.getResult('suitcase' + suitcaseType));
    asset.setTransform(0, 0, scale, scale);

    suitcase.setPosition(new Vector(viewport.dimensions.x, 200));
    suitcase.setVelocity(new Vector(gameSettings.groundSpeed, 0));
    suitcase.startScrolling();

    stage.addChild(asset);

    var getSuitcaseCoords = function() {
        var xOffset = randomBetween(100, viewport.dimensions.x - 100);
        var y = -800;

        var x = xOffset;

        return new Vector(x, y);
    };

    obstacles.push(suitcase);

    entities.push(suitcase);

    return suitcase;
};
