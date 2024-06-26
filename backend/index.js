//IMPORT LIB
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { getStripeUpdates } = require('./controllers/webhooksController');
const socketManager = require('./lib/socket/socketManager');

//IMPORT DB
const { db } = require('./db');

//Import cron
const scheduledTasks = require('./scheduledTasks');

//other import
const { notifyErrorSlack } = require('./lib/services/slack');

// IMPORT ROUTER
const userRouter = require('./routes/userRouter');
const passwordRouter = require('./routes/passwordRouter');
const categoryRouter = require('./routes/categoryRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');
const adminRouter = require('./routes/adminRouter');
const notificationRouter = require('./routes/notificationRouter');
const incomeRouter = require('./routes/incomeRouter');
const emailRouter = require('./routes/emailRouter');
const mediaRouter = require('./routes/mediaRouter');
const nudeRouter = require('./routes/nudeRouter');
const appConfigurationRouter = require('./routes/appConfigurationRouter');
const paymentsRouter = require('./routes/paymentsRouter');
const { getSnsNotification } = require('./controllers/snsController');

const app = express();
const apiPort = process.env.PORT || 3001;

const httpServer = createServer(app);

//init socket
socketManager.init(httpServer);

//Start MongoDB
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  getStripeUpdates,
);

app.post('/sns-notification', bodyParser.text(), getSnsNotification);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.set('trust proxy', true);
app.use(bodyParser.json({ type: 'application/json;charset=UTF-8' }));

//Router
app.use('/api/users', userRouter);
app.use('/api/password', passwordRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/incomes', incomeRouter);
app.use('/api/email', emailRouter);
app.use('/api/medias', mediaRouter);
app.use('/api/nudes', nudeRouter);
app.use('/api/config', appConfigurationRouter);
app.use('/api/payments', paymentsRouter);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/payment/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/stripe-key', (req, res) => {
  res.json({
    stripeKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get('/config', (req, res) => {
  res.json({
    clientUrl: process.env.CLIENT_URL,
  });
});

app.use((err, req, res, next) => {
  notifyErrorSlack(err.stack);
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

//Run the server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(apiPort, () =>
    console.log(`Server running on port ${apiPort}`),
  );
}

module.exports = httpServer;
