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

  let onlineStore = [];
  let onlineUser = [];

  io.on('connection', async (socket) => {
    socket.on('addUser', (user) => {
      console.log(`user id = ${user} connect socket ...`, socket.id);
      if (!onlineUser.some((user) => user.id === user))
        onlineUser.push({ id: user, socket_id: socket.id });
      console.log('onlineStore', onlineStore);
      console.log('onlineUser', onlineUser);
    });
    socket.on('addStore', (store) => {
      console.log(`store id = ${store} connect socket ...`, socket.id);
      if (!onlineStore.some((store) => store.id === store))
        onlineStore.push({ id: store, socket_id: socket.id });
      console.log('onlineStore', onlineStore);
      console.log('onlineUser', onlineUser);
    });
    socket.on('sendMassage', ({ sender, receiverId, message }) => {
      if (sender === 1) {
        const receiver = onlineStore.filter((store) => store.id === receiverId);
        console.log('receiver', receiver);
        if (receiver.length > 0) {
          for (const item of receiver) {
            io.to(item.socket_id).emit('receiveMessage', message);
          }
        }
      }
      if (sender === 2) {
        const receiver = onlineUser.filter((user) => user.id === receiverId);
        console.log('receiver', receiver);
        if (receiver.length > 0) {
          for (const item of receiver) {
            io.to(item.socket_id).emit('receiveMessage', message);
          }
        }
      }
    });
    socket.on('exchangeResult', (result) => {
      const receiver = onlineUser.filter((user) => user.id === result.user_id);
      if (receiver.length > 0 && result.result)
        for (const item of receiver) {
          io.to(item.socket_id).emit('exchangeSuccess', result);
        }
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
      console.log(`user disconnect socket ...`, socket.id);
      onlineStore = onlineStore.filter(
        (store) => store.socket_id !== socket.id
      );
      onlineUser = onlineUser.filter((user) => user.socket_id !== socket.id);
      console.log('onlineStore', onlineStore);
      console.log('onlineUser', onlineUser);
    });
  });
  return io;
}

module.exports = { createServer, io };
