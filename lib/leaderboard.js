var uuid = require('node-uuid');

var playerId = uuid.v1();

var leaderBoard = [];
var emitPlayerData;

var connect = function(callback) {
    emitPlayerData = callback;

    emitPlayerData({
        id: playerId,
        leaderBoard: leaderBoard
    });
};

var addScore = function(score) {
    leaderBoard.push(score);

    emitPlayerData({
        id: playerId,
        leaderBoard: leaderBoard
    });
};

module.exports = {
    connect: connect,
    addScore: addScore
};

