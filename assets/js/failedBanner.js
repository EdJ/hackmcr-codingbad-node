var showFailedBanner = function() {
    var asset = new createjs.Text("Your score is: " + score, "32px Arial", "red");
    asset.setTransform(0, 0, scale, scale);
    asset.y = viewport.dimensions.y / 5;
    asset.x = viewport.dimensions.x / 5;

    stage.addChild(asset);
};
