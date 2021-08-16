
let sockets = [];

const addSocket = ({socketId, userId}) =>{
    const index = sockets.findIndex(item => item.socketId === socketId && item.userId === userId);
    if(index === -1){
        removeThisUserFormerSocketsIfAny(userId, socketId);
        const socket = {socketId, userId};
        sockets.push(socket);
    }    
}

const removeSocket = (socketId)=>{
    const index = sockets.findIndex(socket => socket.socketId === socketId);
    if(index !== -1){
        sockets.splice(index,1);
    }
}

const getAllSockets = ()=>{
    return sockets;
}

const removeAllSockets = ()=>{
    sockets = [];
}

const removeThisUserFormerSocketsIfAny = (userId, newSocketId) =>{
    const index = sockets.findIndex(item => item.socketId !== newSocketId && item.userId === userId);
    if(index !== -1){
        sockets.splice(index, 1);
    }
}


module.exports = {addSocket, removeSocket, getAllSockets, removeAllSockets}