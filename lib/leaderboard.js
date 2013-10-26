var uuid = require('node-uuid');

(function() {

    var playerId = uuid.v1();
    var leaderBoard = [];
    var emitPlayerData;

    var connect = function(callback) {
        emitPlayerData = callback;
        emitPlayerData({
            id: playerId,
            leaderBoard: leaderBoard
        });
    }

    var add_score = function(score) {
        leaderBoard.push(score);      
        emitPlayerData({
            id: playerId,
            leaderBoard: leaderBoard
        });
    }

    module.exports = {
        connect: connect,
        add_score: add_score
    }
})();
