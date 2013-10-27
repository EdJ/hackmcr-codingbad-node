var uuid = require('node-uuid');

var leaderBoard = [];
var emitPlayerData;

var connect = function(callback) {
    emitPlayerData = callback;

    var playerNames = ["Alice", "Bob", "Charlie", "Dean", "Elizabeth", "Frankie", "George",
        "Herbert", "Indigo", "John", "Kelly", "Lee", "Mark", "Nora", "Olivia", "Pete",
        "Queenie", "Robert", "Steve", "Tim", "Ulrick", "Victor", "Wayne", "Yousef", "Zod"
    ];

    emitPlayerData({
        id: uuid.v1(),
        name: playerNames[Math.floor((Math.random() * 26))],
        leaderBoard: leaderBoard
    });
};

var addScore = function(score) {
    leaderBoard.push(score);

    leaderBoard.sort(function(a, b) {
        return b.score - a.score;
    })

    var temp = [];

    for (var i = 0; i < (leaderBoard.length > 10 ? 10 : leaderBoard.length); i++)
    {
        temp.push(leaderBoard[i]);
    }
    leaderBoard = temp;

    emitPlayerData({
        id: score.id,
        leaderBoard: leaderBoard
    });
};

module.exports = {
    connect: connect,
    addScore: addScore
};
