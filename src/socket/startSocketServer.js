const socketIo = require('socket.io');
const uuid = require('uuid');
const {socketEmitter} = require('../evenEmitter');

const startSocketServer = function (server, readLastLines) {
  const io = socketIo.listen(server);

  const on = function (eventType) {
    socketEmitter.on(eventType, (data) => {
      io.emit(eventType, data);
    });
  }

  on('emit_last_some_lines');

  console.log(`websockets listening`);

  io.use(function (socket, next) {
    socket.request.id = uuid.v4();
    next();
  });

  io.on('connection', function (socket) {
    socket.join('public');

    socket.once('join', async function () {
      const lastLines = await readLastLines();
      socket.emit('info', lastLines);
    });

    socket.on('disconnect', function () {
    });
    socket.on('error', function (e) {
      console.log('CAUGHT', e);
    });
  });

  return io;
};

module.exports = startSocketServer;
