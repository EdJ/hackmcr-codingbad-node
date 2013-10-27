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

    it('generates a random name', function(done) {
        leaderboard.connect(function(playerData) {
            playerData.name.should.not.be.null;

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
            var lastScore = 0;
            for (var i = playerData.leaderBoard.length; i--;) {
                var value = playerData.leaderBoard[i].score;

                value.should.be.at.least(lastScore);
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

    it('leaderboard should only fire top 10', function() {
        leaderboard.connect(function(playerData) {
            var hadItem = false;
            var lastScore = 0;
            for (var i = playerData.leaderBoard.length; i--;) {
                var value = playerData.leaderBoard[i].score;

                value.should.be.at.least(lastScore);
                lastScore = value;

                hadItem = true;
            }
            playerData.leaderBoard.length.should.be.at.most(10);

            hadItem.should.equal(true);
        });

        leaderboard.addScore({ id: 1, score: 20 });
        leaderboard.addScore({ id: 1, score: 10 });
        leaderboard.addScore({ id: 1, score: 5 });
        leaderboard.addScore({ id: 1, score: 34 });
        leaderboard.addScore({ id: 1, score: 56 });
        leaderboard.addScore({ id: 1, score: 20 });
        leaderboard.addScore({ id: 1, score: 19 });
        leaderboard.addScore({ id: 1, score: 45 });
        leaderboard.addScore({ id: 1, score: 23 });
        leaderboard.addScore({ id: 1, score: 56 });
        leaderboard.addScore({ id: 1, score: 89 });
        leaderboard.addScore({ id: 1, score: 53 });
        leaderboard.addScore({ id: 1, score: 36 });
        leaderboard.addScore({ id: 1, score: 19 });
    });
});
