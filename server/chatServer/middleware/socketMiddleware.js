const jwt = require('jsonwebtoken');

module.exports = (socket, next) => {
    const token = socket.handshake.auth.token;    
    if(token == null){
        next(new Error("No auth token provided")); 
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            next(new Error("Authentication failed"))
        }
        else{
            next();
        }       
    });
}

