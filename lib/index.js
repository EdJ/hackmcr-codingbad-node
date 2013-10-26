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

            res.writeHead(200);
            res.set('Content-Type', 'text/javascript');
            res.end(data);
        });
}

io.sockets.on('connection', function(socket) {
    leaderBoard.connect(function(playerData) {
        socket.emit('player', playerData);
    });

    socket.on('score', function(playerData) {
        leaderBoard.addScore(playerData);
    });
});
