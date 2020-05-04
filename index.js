/* REQUIREMENTS */
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var scoreBoard = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/template', function(req, res) {
	res.sendFile(__dirname + '/template.html');
});

app.get('/control', function(req, res) {
	res.sendFile(__dirname + '/control.html');
});

io.on('connection', function(socket) {
	console.log(socket.id + ' has connected');

  /*socket.on('disconnect', function (socket) {
    console.log(socket + ' has disconnected');
  });*/

	socket.on('LoadGame', function(data) {
		socket.broadcast.emit('LoadGame', data);
	});

	socket.on('NewGame', function(data) {
		console.log('Loaded ' + data.msg + ' on ' + data.id);
	});

	socket.on('RPSNewRound', function(data) {
		socket.broadcast.emit('BeginGame');
		console.log('RPS round has started');
	});

	socket.on('RPSEndRound', function(data) {
		socket.broadcast.emit('EndGame');
		console.log('RPS round has ended');
	});

  socket.on('SendScore', function(data) {
    console.log('score received from '+ data.id);
    var scoreSet = false;
    for (item of scoreBoard) {
      if (item.id == data.id) {
        item.score += data.msg;
        scoreSet = true;
      }
    }
    if (scoreSet == true) {
      console.log(data.id + '\'s score has increased by ' + data.msg);
    }
    if (scoreSet == false) {
      console.log('player not found...')
      scoreBoard.push({
        "id"    : data.id,
        "score" : data.msg
      });
      console.log('The following information has been added to the scoreBoard[]');
      console.log(scoreBoard[scoreBoard.length-1]);
    }
  });

  socket.on('LogScores', function() {
    for (item of scoreBoard) {
    console.log(item.id + '\'s score is: ' + item.score);
  }
  });
});

http.listen(3000, function() {
	console.log('server listening on port: 3000');
});
