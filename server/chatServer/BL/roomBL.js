const {Promise } = require('bluebird');
const Room = require('../schemas/roomSchema')
const userBL = require('./userBL');
const Mutex = require('async-mutex').Mutex;

const mutex = new Mutex();

const getAllRooms = ()=>{
    return Room.find({});
}

const getRoomById = async(id)=>{ 
    let answer = await Room.findById(id);   
    return answer;
}

const getRoomsByUser = async(userId)=>{    
    const user = await userBL.getUserById(userId);
    const userRoomIds = user.rooms;
    let answer = [];
    for( let i = 0 ; i< userRoomIds.length ; i++ ){ 
        let room = await getRoomById(userRoomIds[i]);
        answer.push(room);
    }
    return answer;
}

const addMessage = async(fromId, roomId, body, created)=>{
    const message =
    {
        fromId : fromId,
        toId : roomId,
        body : body,
        createdTime : created,
        sentTo : [await getRoomMemberIds(roomId)],
        deliveredTo : [],
        readBy : [fromId],
        deliveredToAll : false,
        readByAll : false,
    }
    let room = await getRoomById(roomId);
    let messageArr = await room.messages;
    messageArr.push(message);
    room.messages = messageArr; 
    let answer = await updateRoom(roomId, room); 
    return answer;    
}

const getRoomMemberIds = async(roomId) =>{
    const room = await getRoomById(roomId);
    return room.members.map(member => member.memberId);
}

const createRoomMembersByUserIds = async(userIds) =>{
    let roomMembers = [];
    for(let i=0; i< userIds.length; i++){
        const resp =  await userBL.getUserById(userIds[i]); 
        const user = await JSON.parse(JSON.stringify(resp));
        let member = {memberName : user.name, memberId : user._id}
        roomMembers.push(member);        
    }    
    return roomMembers;
}

const addNewRoomToMembers = (room)=>{
    room.members.forEach(member=>{
        userBL.addRoomToUser(member.memberId, room._id);
    })
}

const addGroup = async(groupName, friendsIds, adminId)=>{
    let groupMembers = await createRoomMembersByUserIds(friendsIds);
    let newRoom = {            
        name : groupName,
        members : groupMembers,
        isGroup : true,
        admins : [adminId], 
        messages : [] ,          
    }    
    let roomAnswer = await addRoom(newRoom);
    addNewRoomToMembers(roomAnswer);    
    return roomAnswer;
}

const addP2PChat = async(user1Id, user2Id) =>{
    let isBlocked = await userBL.isBlocked(user1Id, user2Id);
    if(isBlocked){
        return {isBlocked: true, alreadyExists: false, payload : null};
    }
    let roomAlreadyExists = await usersAlreadyHaveP2PChat(user1Id, user2Id);
    if(roomAlreadyExists.alreadyExists === true){
        return roomAlreadyExists;
    }
    else{   
        let members = await createRoomMembersByUserIds([user1Id, user2Id]);               
        const roomToAdd = new Room(
            {            
                name : '' ,
                members : members ,
                isGroup : false ,
                admins : [], 
                messages : [],          
            })    
        let newRoom = await addRoom(roomToAdd);
        addNewRoomToMembers(newRoom);    
        return {isBlocked: false, alreadyExists: false, payload : newRoom};
    }
}

const usersAlreadyHaveP2PChat = async(user1Id, user2Id) => {
    let rooms = await getAllRooms();
    let answer = {alreadyExists : false, payload : null};
    p2pRooms = rooms.filter(room => room.isGroup === false);
    p2pRooms.forEach(room =>{
        let hasUser1 = false;
        let hasUser2 = false;
        let hasOtherUser = false;
        room.members.forEach(member =>{            
            if(member.memberId === user1Id ){
                hasUser1 = true;
            }
            else if(member.memberId === user2Id ){
                hasUser2 = true;
            }
            else{
                hasOtherUser = true;
            }
        })
        if(hasUser1 && hasUser2 && !hasOtherUser){                        
            answer= {isBlocked: false, alreadyExists : true, payload : room._id};            
        }       
    })
    return answer;
}

const addRoom = async(newRoom) =>{      
    let roomToAdd = new Room(
    {            
        name : newRoom.name ,
        members : newRoom.members ,
        isGroup : newRoom.isGroup ,
        admins : newRoom.admins, 
        messages : newRoom.messages ,          
    })
    let answer = await roomToAdd.save();
    return roomToAdd;
}

const updateRoom = async(roomId,newRoom)=>{
    return new Promise((resolve, reject)=>{
        var roomToUpdate = new Room(
            {               
                _id : roomId,
                name : newRoom.name ,
                members : newRoom.members ,
                isGroup : newRoom.isGroup ,
                admins : newRoom.admins, 
                messages : newRoom.messages , 
            });
        Room.findByIdAndUpdate(roomId,roomToUpdate,{new: true},(err, data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })        
}

const deleteRoom = (RoomId)=>{     
    return new Promise((resolve,reject)=>{
        Room.findByIdAndDelete(RoomId,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            } 
        })
    })
}

const deleteUserFromRoom = async(userId, roomId) =>{
    let room = await getRoomById(roomId);
    let members = room.members;
    let index = members.findIndex(member => member.memberId === userId);
    if(index >= 0){
        members.splice(index, 1);
    }
    room.members = members;
    let answer = await updateRoom(roomId, room);
    return answer;
}

const markMessageAsReadOrDeliveredByUser = async(roomId, messageId, userId, actionType) =>{
    const release = await mutex.acquire();
    try{
        let room = await getRoomById(roomId);     
        let index = room.messages.findIndex(msg => msg._id == messageId);   
        let message = room.messages[index];
        if(actionType == "read"){
            message.readBy.push(userId);
            message.readByAll = CheckIfAllRoomMembersIncludedInArray(room, message.readBy); 
        }
        else if(actionType == "delivered"){ 
            message.deliveredTo.push(userId);
            message.deliveredToAll = CheckIfAllRoomMembersIncludedInArray(room, message.deliveredTo);
        }
        else{
            throw new Error("aciton type must be 'read' or 'delivered'"); 
        }     
        room.messages[index] = message;
        let answer = await updateRoom(roomId, room);   
        return answer;
    }finally{
        release();
    }
}

const CheckIfAllRoomMembersIncludedInArray = (room, arr) =>{
    let answer = true;
    room.members.every(member =>{
        if(!arr.includes(member.memberId)){
          answer = false;
          return false
        }
        return true; 
    })
    return answer;
}

const AllRoomMessagesDeliveredToUser = async(userId, roomId, callback)=>{
    let room = await getRoomById(roomId);
    let notifyMembers = false;
    for(let i=0; i< room.messages.length ; i++){        
        if(!room.messages[i].deliveredTo.includes(userId)){
            await markMessageAsReadOrDeliveredByUser(roomId, room.messages[i]._id.toString(), userId, "delivered");
            notifyMembers = true;
        }
    }
    if(notifyMembers){
        callback(room.members);
    }
}


module.exports = {addRoom, updateRoom, getAllRooms, getRoomById, deleteRoom, markMessageAsReadOrDeliveredByUser,
                  getRoomsByUser, addMessage, addP2PChat, addGroup, deleteUserFromRoom, AllRoomMessagesDeliveredToUser}