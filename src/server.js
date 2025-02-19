const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const http = require('http');

const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const redisService = require('./services/redisService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// WebSocket setup for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial GPIO states
  socket.on('getGpioStates', async () => {
    const states = await Promise.all([
      redisService.getGpioState('D16'),
      redisService.getGpioState('D17')
    ]);
    socket.emit('gpioStates', states);
  });

  // Send initial serial data history
  socket.on('getSerialHistory', async () => {
    const history = await redisService.getSerialHistory();
    socket.emit('serialHistory', history);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Broadcast updates when new data is received
const broadcastUpdates = async () => {
  const serialHistory = await redisService.getSerialHistory(1);
  const gpioStates = await Promise.all([
    redisService.getGpioState('D16'),
    redisService.getGpioState('D17')
  ]);

  io.emit('serialUpdate', serialHistory[0]);
  io.emit('gpioStates', gpioStates);
};

// Set up periodic broadcasts
setInterval(broadcastUpdates, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;