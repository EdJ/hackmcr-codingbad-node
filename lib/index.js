var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var uuid = require('node-uuid');

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
            res.end(data);
        });
}


var playerId = uuid.v1();
var leaderBoard = [];


io.sockets.on('connection', function(socket) {
    socket.emit('player', {
        id: playerId,
        leaderBoard: leaderBoard
    });

    socket.on('score', function(playerData) {
    	leaderBoard.push(playerData);
        console.log(playerData);
    });   
});
