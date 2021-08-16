const {Promise} = require('bluebird')
const User = require('../models/userSchema')

const getAllUsers = ()=>{
    return new Promise((resolve,reject)=>{
        User.find({},(err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}

const getUserById = (id)=>{
    return new Promise((resolve,reject)=>{
        User.findById(id,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const getUserByUsername = (username)=>{
    return new Promise((resolve,reject)=>{        
        User.findOne({username : username}, (err,data) =>{
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

const addUser = (newUser) =>{
    return new Promise((resolve,reject)=>{        
        let userToAdd = new User(
        {            
            username : newUser.username ,
            password : newUser.password ,        
        })
        userToAdd.save((err,data)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}

const updateUser = (id,user)=>{
    return new Promise((resolve,reject)=>{
        var newUser = new User(
            {               
                _id : id,
                username : user.username ,
                password : user.password ,
                userId : user.userId   
            })            
            User.findByIdAndUpdate(id,newUser,(err, data)=>{
                if(err){
                    reject(err)
                }
                else{
                    resolve(newUser)
                }
            })
    })
}

const deleteUser = (userId)=>{    
    return new Promise((resolve,reject)=>{
        User.findByIdAndDelete(userId,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            } 
        })
    })
}

module.exports = {addUser, updateUser, getUserByUsername, getAllUsers, getUserById, deleteUser}