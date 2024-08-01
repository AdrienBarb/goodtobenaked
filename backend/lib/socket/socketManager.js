const { Redis } = require('ioredis');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');

class SocketManager {
  constructor() {
    this.io = null;
    this.users = [];
  }

  init(httpServer) {
    console.log('process.env.REDIS_URL', process.env.REDIS_URL);
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; // Utilisez l'URL de Redis depuis l'environnement
    const pubClient = new Redis(redisUrl, {
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 20,
    });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
      console.error('Redis pubClient error:', err);
    });

    subClient.on('error', (err) => {
      console.error('Redis subClient error:', err);
    });

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      adapter: createAdapter(pubClient, subClient),
    });

    this.configureSocketEvents();
    console.log('Socket.IO initialized');
  }

  configureSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('New client connected', socket.id);

      socket.on('addUser', (userId) => {
        console.log('User added:', userId);
        this.addUser(userId, socket.id);
        this.io.emit('getUsers', this.users);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        this.removeUser(socket.id);
        this.io.emit('getUsers', this.users);
      });

      // Send and get message
      socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        const user = this.getUser(receiverId);
        if (user) {
          console.log('Message sent from', senderId, 'to', receiverId);
          this.io.to(user.socketId).emit('getMessage', {
            senderId,
            message,
          });
        }
      });

      // Send and get notification
      socket.on('sendNotification', ({ receiverId, conversationId }) => {
        const user = this.getUser(receiverId);
        if (user) {
          console.log('Notification sent to', receiverId);
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
      console.log('Emitting event', event, 'to user', userId);
      this.io.to(user.socketId).emit(event, data);
    }
  }
}

module.exports = new SocketManager();
