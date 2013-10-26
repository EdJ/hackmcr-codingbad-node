 (function() {
     var socket = io.connect('/');
     var playerScore = Math.floor((Math.random()*1000));;
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
