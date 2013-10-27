var showStartBanner = function() {
    var asset = new createjs.Text("Hurry " + localStorage.playerName + "! The plane's about to leave!", "32px Arial", "red");
    asset.setTransform(0, 0, scale, scale);
    asset.y = 100;
    asset.x = 100;

    stage.addChild(asset);

    var ticks = 0;

    var fn = function() {
        ticks = ticks + 1;
        if (ticks > 200) {
            stage.removeChild(asset);

            createjs.Ticker.removeEventListener('tick', fn);
        }
    };

    createjs.Ticker.addEventListener('tick', fn);
};
