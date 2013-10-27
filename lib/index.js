var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var leaderBoard = require('./leaderboard');

app.listen(process.env.PORT || 1234);

function handler(req, res) {
	var fileName = 'index.html';

	if (req.url != '/') {
		fileName = req.url.substr(1);
	}

	fs.readFile(__dirname + '/../assets/' + fileName,
	function(err, data) {
		if (err) {
			console.log(err);

			res.writeHead(500);
			return res.end('Error loading file');
		}

		if (fileName.substr(fileName.length - 3) === '.js'){
			res.setHeader('Content-Type', 'text/javascript');
		} else if (fileName.substr(fileName.length - 4) === '.css'){
			res.setHeader('Content-Type', 'text/css');
		}

		res.writeHead(200);
		res.end(data);
	});
}

io.sockets.on('connection', function(socket) {
	leaderBoard.connect(function(playerData) {
		io.sockets.emit('player', playerData);
	});
	
	socket.on('score', function(playerData) {
		leaderBoard.addScore(playerData);
	});
});
