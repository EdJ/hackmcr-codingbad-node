require('chai').should();
var leaderboard = require('../lib/leaderboard');

describe('leaderboard', function () {
	it('connect emits initial player data', function(done) {
		leaderboard.connect(function(playerData) {
			playerData.id.should.not.be.null;
			playerData.leaderBoard.should.not.be.null;
			done();
		});
	})
});