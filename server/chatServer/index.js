require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const socketEventsHandler = require ('./socketEventsHandler');
const socketMiddleware = require('./middleware/socketMiddleware');
const http = require('http');
const cors = require('cors');
const router = require('./router');
const middleware = require('./middleware/middleware');
const path = require('path');
const userBL = require('./BL/userBL')

require('./configs/database');
const userController = require('./controllers/userController')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(middleware.authenticateToken);
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use('/users', userController)
app.use(router);

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

io.use(socketMiddleware);
socketEventsHandler(io);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/chatterbox/build'));

  app.get('*', (req, res)=>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


server.listen(PORT, async()=>{
    console.log(`server is up on port ${PORT}`);
});

