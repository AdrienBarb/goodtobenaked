const { Redis } = require('ioredis');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');

class SocketManager {
  constructor() {
    this.io = null;
    this.pubClient = null;
    this.subClient = null;
  }

  init(httpServer) {
    console.log('process.env.REDIS_URL', process.env.REDIS_URL);
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.pubClient = new Redis(redisUrl, {
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 20,
    });
    this.subClient = this.pubClient.duplicate();

    this.pubClient.on('error', (err) => {
      console.error('Redis pubClient error:', err);
    });

    this.subClient.on('error', (err) => {
      console.error('Redis subClient error:', err);
    });

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      adapter: createAdapter(this.pubClient, this.subClient),
    });

    this.configureSocketEvents();
    console.log('Socket.IO initialized');
  }

  configureSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('New client connected', socket.id);

      socket.on('addUser', async (userId) => {
        console.log('User added:', userId);
        await this.addUser(userId, socket.id);
        const users = await this.getUsers();
        this.io.emit('getUsers', users);
      });

      socket.on('disconnect', async () => {
        console.log('Client disconnected', socket.id);
        await this.removeUser(socket.id);
        const users = await this.getUsers();
        this.io.emit('getUsers', users);
      });

      // Send and get message
      socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        const user = await this.getUser(receiverId);
        if (user) {
          console.log('Message sent from', senderId, 'to', receiverId);
          this.io.to(user.socketId).emit('getMessage', {
            senderId,
            message,
          });
        }
      });

      // Send and get notification
      socket.on('sendNotification', async ({ receiverId, conversationId }) => {
        const user = await this.getUser(receiverId);
        if (user) {
          console.log('Notification sent to', receiverId);
          this.io.to(user.socketId).emit('getNotification', {
            conversationId,
          });
        }
      });
    });
  }

  async addUser(userId, socketId) {
    await this.pubClient.hset('users', userId, socketId);
  }

  async removeUser(socketId) {
    const users = await this.pubClient.hgetall('users');
    for (const userId in users) {
      if (users[userId] === socketId) {
        await this.pubClient.hdel('users', userId);
      }
    }
  }

  async getUser(userId) {
    const socketId = await this.pubClient.hget('users', userId);
    return socketId ? { userId, socketId } : null;
  }

  async getUsers() {
    const users = await this.pubClient.hgetall('users');
    return Object.keys(users).map((userId) => ({
      userId,
      socketId: users[userId],
    }));
  }

  async emitToUser(userId, event, data) {
    const users = await this.getUsers();
    console.log('users ', users);
    console.log('user : ', userId);
    const user = await this.getUser(userId);
    if (user) {
      console.log('Emitting event', event, 'to user', userId);
      this.io.to(user.socketId).emit(event, data);
    }
  }
}

module.exports = new SocketManager();
