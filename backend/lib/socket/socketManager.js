const { Redis } = require('ioredis');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');

class SocketManager {
  constructor() {
    this.io = null;
    this.users = [];
  }

  init(httpServer) {
    const pubClient = new Redis();
    const subClient = pubClient.duplicate();

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      adapter: createAdapter(pubClient, subClient),
    });

    this.configureSocketEvents();
  }

  configureSocketEvents() {
    this.io.on('connection', (socket) => {
      socket.on('addUser', (userId) => {
        this.addUser(userId, socket.id);
        this.io.emit('getUsers', this.users);
      });

      socket.on('disconnect', () => {
        this.removeUser(socket.id);
        this.io.emit('getUsers', this.users);
      });

      //Send and get message
      socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        const user = this.getUser(receiverId);
        if (user) {
          this.io.to(user.socketId).emit('getMessage', {
            senderId,
            message,
          });
        }
      });

      //Send and get message
      socket.on('sendNotification', ({ receiverId, conversationId }) => {
        const user = this.getUser(receiverId);
        if (user) {
          this.io.to(user.socketId).emit('getNotification', {
            conversationId,
          });
        }
      });
    });
  }

  addUser(userId, socketId) {
    if (!this.users.some((user) => user.userId === userId)) {
      this.users.push({ userId, socketId });
    }
  }

  removeUser(socketId) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  getUser(userId) {
    return this.users.find((user) => user.userId === userId);
  }

  emitToUser(userId, event, data) {
    const user = this.getUser(userId);

    if (user) {
      this.io.to(user.socketId).emit(event, data);
    }
  }
}

module.exports = new SocketManager();
