var playerId;
var playerName;
var socket;

var leaderboard = {
    gameOver: function(score) {
        socket.emit('score', {
            id: playerId,
            name: playerName,
            score: score
        });
    }
};

var setupLeaderBoard = function() {

    var playerScores;
    var leaderboardStage;
    var scoreTextEntities = [];

    var connect = function() {
        socket = io.connect('/');
        socket.on('player', function(data) {
            playerId = localStorage.getItem('playerId') || data.id;
            localStorage.setItem('playerId', playerId);
            playerName = localStorage.getItem('playerName') || data.name;
            localStorage.setItem('playerName', playerName);
            console.log(JSON.stringify(data));

            for (var i = 0; i < scoreTextEntities.length; i++) {
                leaderboardStage.removeChild(scoreTextEntities[i])
            }

            for (var i = 0; i < data.leaderBoard.length; i++) {
                var title = new createjs.Text(i + 1, "18px Arial", "#6C5D75");
                title.y = 80 + (20 * i);
                title.x = 15;
                leaderboardStage.addChild(title);
                scoreTextEntities.push(title);
                var title = new createjs.Text(data.leaderBoard[i].name, "15px Arial", "#6C5D75");
                title.y = 80 + (20 * i);
                title.x = 100;
                leaderboardStage.addChild(title);
                scoreTextEntities.push(title);
                var title = new createjs.Text(data.leaderBoard[i].score, "20px Times New Roman Bold", "#EC0000");
                title.y = 80 + (20 * i);
                title.x = 400;
                leaderboardStage.addChild(title);
                scoreTextEntities.push(title);
                leaderboardStage.update();
            };
        });
    };

    connect();

    leaderboardStage = new createjs.Stage("leaderBoard");

    leaderboardStage.mouseEventsEnabled = true;
    var rect = new createjs.Shape();
    rect.graphics.beginFill("#CECECE").drawRect(0, 0, 500, 300);

    var lbTitleBar = new createjs.Shape();
    lbTitleBar.graphics.beginFill("#211B1B").drawRect(0, 0, 500, 50);

    var lbsubTitleBar = new createjs.Shape();
    lbsubTitleBar.graphics.beginFill("#F25B15").drawRect(0, 50, 500, 30);

    var txt = new createjs.Text("Travelator Leaderboard", "17px Arial", "#FFF");
    txt.y = 15;
    txt.x = 15;

    var rankTitle = new createjs.Text("Rank", "15px Arial", "#DBD8E9");
    rankTitle.y = 55;
    rankTitle.x = 15;

    var playerTitle = new createjs.Text("Player Name", "15px Arial", "#DBD8E9");
    playerTitle.y = 55;
    playerTitle.x = 100;

    var scoreTitle = new createjs.Text("Score", "15px Arial", "#DBD8E9");
    scoreTitle.y = 55;
    scoreTitle.x = 400;

    leaderboardStage.addChild(rect);
    leaderboardStage.addChild(lbTitleBar);
    leaderboardStage.addChild(lbsubTitleBar)
    leaderboardStage.addChild(txt);
    leaderboardStage.addChild(rankTitle);
    leaderboardStage.addChild(playerTitle);
    leaderboardStage.addChild(scoreTitle);

    rect.addEventListener("click", function() {
        var playerScore = Math.floor((Math.random() * 1000));
        leaderboard.gameOver(playerScore)
    });

    leaderboardStage.update();
}
