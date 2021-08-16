const {Promise } = require('bluebird');
const User = require('../schemas/userSchema');


const addRoomToUser = async(userId, roomId) =>{
    let user = await getUserById(userId);
    let arr = await user.rooms;
    arr.push(roomId);
    let newUser = 
        {            
            name : user.name ,
            blocked : user.blocked ,
            rooms : arr ,          
        }
    updateUser(userId, newUser);       
}

const deleteRoomFromUser = async(userId, roomId)=>{
    let user = await getUserById(userId);
    let userRooms = await user.rooms;
    let index = userRooms.findIndex(id => id === roomId)
    if(index >= 0){
        userRooms.splice(index, 1);
    }
    let newUser = 
        {            
            name : user.name ,
            blocked : user.blocked ,
            rooms : userRooms ,          
        }
    let answer = updateUser(userId, newUser);
    return answer;
}

const getUserByName = (username)=>{
    return new Promise((resolve, reject)=>{
        User.findOne({name : username}, (err, data)=>{
            if(err){
                reject(err);
            }
            else{
                if(data){
                    resolve(data);
                }
                else{
                    resolve(false);
                }
            }
        })
    })
}

const getAllUsers = async()=>{
    let answer = await User.find({});
    return answer;
}

const getUserById = async(id)=>{
    let answer = await User.findById(id);
    return answer;
}

const addUser = (newUser) =>{
    return new Promise((resolve,reject)=>{        
        let userToAdd = new User(
        {            
            name : newUser.name ,
            blocked : newUser.blocked ,
            rooms : newUser.rooms ,          
        })
        userToAdd.save((err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data);
            }
        })
    })
}

const updateUser = (userId,newUser)=>{
    var userToUpdate = new User(
        {    
            _id : userId,           
            name : newUser.name ,
            blocked : newUser.blocked ,
            rooms : newUser.rooms ,  
        })  
    return new Promise((resolve, reject)=>{                     
        User.findByIdAndUpdate(userId,userToUpdate, (err, data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        }); 
    })                  
}

const deleteUser = (UserId)=>{    
    return new Promise((resolve,reject)=>{
        User.findByIdAndDelete(UserId,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            } 
        })
    })
}

const isBlocked = async(blockerId, blockedId)=>{
    let user = await getUserById(blockerId);
    let answer = user.blocked.includes(blockedId);
    return answer;
}

const blockUser = async(blockerId, blockedId, roomId) =>{
    let user = await getUserById(blockerId);
    let arr = await user.blocked;
    arr.push(blockedId);
    let newUser = 
        {            
            name : user.name ,
            blocked : arr ,
            rooms : user.rooms ,          
        }
    updateUser(blockerId, newUser);
    deleteRoomFromUser(blockerId, roomId);
    deleteRoomFromUser(blockedId, roomId);
}

module.exports = {addUser, updateUser, getAllUsers, getUserById, deleteUser, addRoomToUser, blockUser, deleteRoomFromUser,
                  isBlocked, deleteRoomFromUser, getUserByName}