const { Server } = require('socket.io');
const { moderateMessage, handleViolation } = require('./middleware/chatModerator');
const prisma = require('./prismaClient');

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('join', ({ userId }) => { socket.data.userId = userId; socket.join('global'); });

    socket.on('message', async (payload) => {
      const userId = socket.data.userId || payload.userId;
      if (!userId) return socket.emit('error', 'Missing userId');
      const { verdict } = await moderateMessage(userId, payload.text);
      if (verdict === 'SAFE') {
        io.to('global').emit('message', { userId, text: payload.text, ts: Date.now() });
      } else {
        const v = await handleViolation(userId);
        socket.emit('warning', { message: 'Your message was blocked', offenseCount: v.offenseCount || 1 });
        if (v.banned) {
          socket.emit('ban_user', { reason: 'Repeated violations' });
          socket.disconnect(true);
        }
      }
    });
  });

  return io;
}

module.exports = setupSocket;
