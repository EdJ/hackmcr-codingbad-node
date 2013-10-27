var uuid = require('node-uuid');

var leaderBoard = [];
var emitPlayerData;

var connect = function(callback) {
    emitPlayerData = callback;

    emitPlayerData({
        id: uuid.v1(),
        leaderBoard: leaderBoard
    });
};

var addScore = function(score) {
    leaderBoard.push(score);

    leaderBoard.sort(function(a, b) {
        return a.score - b.score;
    })

    emitPlayerData({
        id: score.id,
        leaderBoard: leaderBoard
    });
};

module.exports = {
    connect: connect,
    addScore: addScore
};
