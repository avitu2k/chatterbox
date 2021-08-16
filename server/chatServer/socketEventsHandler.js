const userBL = require('./BL/userBL');
const roomBL = require('./BL/roomBL');
const socketBL = require('./socketManagement');

module.exports = (io) =>{   
    io.on('connection', async(socket) => { 
        
        socket.on('fetchData', async(userId, callback)=>{
            socketBL.addSocket({socketId : socket.id, userId : userId});      
            const allUsers = await userBL.getAllUsers();
            const userRooms = await roomBL.getRoomsByUser(userId);
            callback({allUsers, userRooms});
        })
    
        socket.on('addChat', async({firstUserId, secondUserId}, callback)=>{        
            let roomAnswer = await roomBL.addP2PChat(firstUserId, secondUserId);
            if(roomAnswer.isBlocked === true){
                callback(false);
            }
            else if(roomAnswer.alreadyExists === true){
                callback(roomAnswer.payload);
            }
            else{
                room = roomAnswer.payload;
                emitToMembers(room.members);                  
            }        
        })
    
        socket.on('addGroup', async({groupName, friends, adminId})=>{
            let roomAnswer = await roomBL.addGroup(groupName, friends, adminId);
            emitToMembers(roomAnswer.members);                     
        })
    
        socket.on('sendMessage', async({senderId, roomId, body, createdTime})=>{
            let updatedRoom = await roomBL.addMessage(senderId, roomId, body, createdTime); 
            let membersInRoom = updatedRoom.members; 
            emitToMembers(membersInRoom);    
        });    
    
        socket.on('disconnect', ()=>{
            socketBL.removeSocket(socket.id);
        })
        
        socket.on('blockUser', async({blockerId, blockedId, roomId})=>{
            userBL.blockUser(blockerId, blockedId, roomId);
            roomBL.deleteRoom(roomId);
            findUserSocketAndEmitUpdatedData(blockerId)
        })
    
        socket.on('leaveGroup', async({userId, roomId})=>{
            let newUser = await userBL.deleteRoomFromUser(userId, roomId);
            let newRoom = await roomBL.deleteUserFromRoom(userId, roomId);
            let message = `${newUser.name} has left the group`;
            roomBL.addMessage("admin", roomId, message, new Date());
            emitToMembers(newRoom.members, 'newRoom', newRoom);
            findUserSocketAndEmitUpdatedData(userId);
            emitToMembers(newRoom.members);
        })

        socket.on('markAsReadOrDelivered', async({roomId, messageId, userId, actionType}) =>{         
            let newRoom = await roomBL.markMessageAsReadOrDeliveredByUser(roomId, messageId, userId, actionType);
            let index = newRoom.messages.findIndex(msg => msg._id == messageId);
            findUserSocketAndEmitUpdatedData(userId);
            if(index && newRoom.messages[index].readByAll ){
                findUserSocketAndEmitUpdatedData(newRoom.messages[index].fromId);
            }            
        })

        socket.on('dataReceviedAck', async(userId) =>{
            let user = await userBL.getUserById(userId);  
            user.rooms.forEach(roomId => {
            roomBL.AllRoomMessagesDeliveredToUser(userId, roomId, (memberToNotify)=>{
                emitToMembers(memberToNotify);
            }); 
            })           
        })
    })
    
    const emitToMembers = (members)=>{
        members.forEach(member=> {
            findUserSocketAndEmitUpdatedData(member.memberId);
        })
    }
    
    const findUserSocketAndEmitUpdatedData = async(userId)=>{    
        let sockets = socketBL.getAllSockets();
        let index = sockets.findIndex(socket => socket.userId === userId);        
        if(index >= 0){             
            const user = await userBL.getUserById(userId);
            io.to(sockets[index].socketId).emit("update", user); 
        } 
    }

    
}