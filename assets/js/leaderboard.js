 (function () {
     var socket = io.connect('/');
     var playerScore = 20;
     var playerId;
     socket.on('player', function(data) {
         playerId = data.id;
         console.log(JSON.stringify(data));

         socket.emit('score', {
             id: playerId,
             score: playerScore
         });
     });
 })();