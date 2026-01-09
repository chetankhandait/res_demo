const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const menuRoutes = require('./routes/menu');
const tableRoutes = require('./routes/tables');
const orderRoutes = require('./routes/orders');
const kitchenRoutes = require('./routes/kitchen');
const paymentRoutes = require('./routes/payment');
const analyticsRoutes = require('./routes/analytics');
const queueManager = require('./services/queueManager');

app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.io connection
// Pass IO to QueueManager immediately
queueManager.setSocketIo(io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-table', (tableId) => {
    socket.join(`table-${tableId}`);
    console.log(`Client joined table-${tableId}`);
  });

  socket.on('join-station', (stationId) => {
    socket.join(`station-${stationId}`);
    console.log(`Client joined station-${stationId}`);
  });

  socket.on('join-manager', () => {
    socket.join('manager');
    console.log('Client joined manager room');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
  res.send('Restaurant Ordering System API is running...');
});

// Database Sync and Server Start
const PORT = process.env.PORT || 5000;

const { startCronJobs } = require('./services/scheduler');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync models (force: false in production)
    // await sequelize.sync({ force: false }); 
    // console.log('Database synced.');

    // Load active queues
    await queueManager.loadActiveQueues();

    // Start Background Jobs
    startCronJobs();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

startServer();
