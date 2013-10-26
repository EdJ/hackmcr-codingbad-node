 (function() {
     var socket = io.connect('/');
     var playerScore = 20;
     var playerId;
     var firstTime = true;
     socket.on('player', function(data) {
         playerId = data.id;
         console.log(JSON.stringify(data));

         if (firstTime) {
             socket.emit('score', {
                 id: playerId,
                 score: playerScore
             });
             firstTime = false;
         }
     });
 })();
