const express = require('express');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

//Inicio de servidor más pro
app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), () => console.log('Servidor iniciado en ' + app.get('port')));

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public');
});

io.on('connection', (socket) => {
  io.emit('socket_conectado',
    'Un nuevo socket se ha conectado: '
    + socket.id + '<br>');

  socket.on('disconnect', () => {
    io.emit('socket_desconectado', {
      texto: 'Socket desconectado.',
      id: socket.id,
    });
  });

  socket.on('chat:mensaje', (data) => {
    io.emit('chat:mensaje', data);
  });

  socket.on('chat:escribiendo', (usuario) => {
    socket.broadcast.emit('chat:escribiendo', usuario);
  });
});