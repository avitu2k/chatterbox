const express = require('express');
const http = require('http');
const cors = require('cors');
require('./configs/database');
var authController = require('./controllers/authController')

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors({
    origin: '*'
  }));
app.use('/', authController);

server.listen(PORT, ()=>{
    console.log(`server is up on port ${PORT}`);
});

