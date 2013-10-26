var uuid = require('node-uuid');

(function() {

    var playerId = uuid.v1();
    var leaderBoard = [];

    var connect = function(emitPlayerData) {
        emitPlayerData({
            id: playerId,
            leaderBoard: leaderBoard
        });
    }

    var add_score = function(score) {
        leaderBoard.push(score);
        console.log(score);
    }

    module.exports = {
        connect: connect,
        add_score: add_score
    }
})();
