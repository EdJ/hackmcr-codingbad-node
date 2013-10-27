var showStartBanner = function() {
    var asset = new createjs.Text("Hurry " + localStorage.playerName + "!\nYour plane's about to leave,\nbut watch out for bags!", "32px Arial", "red");
    asset.setTransform(0, 0, scale, scale);
    asset.y = viewport.dimensions.y / 5;
    asset.x = viewport.dimensions.x / 5;

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
