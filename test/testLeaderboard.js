require('chai').should();
var leaderboard = require('../lib/leaderboard');

describe('leaderboard', function() {
    it('connect emits initial player data', function(done) {
        leaderboard.connect(function(playerData) {
            playerData.id.should.not.be.null;
            playerData.leaderBoard.should.not.be.null;

            done();
        });
    });
    
    it('update leaderboard with player score', function(done) {
        var firstFire = true;
        leaderboard.connect(function(playerData) {
            if (firstFire) {
                firstFire = false;
                return;
            }

            var hadItem = false;
            for (var i = playerData.leaderBoard.length; i--;) {
                var value = playerData.leaderBoard[i];

                if (value.id == 1) {
                    value.should.eql({
                        id: 1,
                        score: 20
                    });

                    hadItem = true;
                }
            }

            hadItem.should.equal(true);

            done();
        });

        leaderboard.addScore({
            id: 1,
            score: 20
        });
    });

    it('leaderboard should remain sorted', function() {
        leaderboard.connect(function(playerData) {
            var hadItem = false;
            var lastScore = Number.MAX_VALUE;
            for (var i = playerData.leaderBoard.length; i--;) {
                var value = playerData.leaderBoard[i].score;

                value.should.be.at.most(lastScore);
                lastScore = value;

                hadItem = true;
            }

            hadItem.should.equal(true);
        });
        
        leaderboard.addScore({
            id: 1,
            score: 20
        });
        
        leaderboard.addScore({
            id: 1,
            score: 30
        });
        
        leaderboard.addScore({
            id: 1,
            score: 10
        });
        
        leaderboard.addScore({
            id: 1,
            score: 50
        });
        
        leaderboard.addScore({
            id: 1,
            score: 5
        });
    });
});
