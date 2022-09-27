const { Server } = require('socket.io');
let io = null;

function createServer(server) {
  if (io !== null) {
    return io;
  }
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      allowedHeaders: ['Access-Control-Allow-Origin'],
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    console.log(`user connect socket ...`, socket.id);
    socket.on('text', (msg) => {
      socket.emit('reply', { status: 'ok', msg: '成功' });
      socket.broadcast.emit('otherOne', msg);
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
    });
  });
  return io;
}

module.exports = { createServer, io };
