require('dotenv').config();
const axios = require('axios');
const userDAL = require('../DAL/userDAL');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async(user)=>{
    const userFromDB = await userDAL.getUserByUsername(user.username);
    if(userFromDB){
        return false;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);                          
    const newUser = await addUser({username : user.username , password: hashedPassword, userId: ""});
    const loginResp = await login(user);
    const accessToken = loginResp.accessToken;
    if(accessToken && newUser){
        const headers = { headers : { Authorization : 'Bearer ' + accessToken}};
        const userToAddToChatServer = {            
            name : newUser.username,
            blocked : [],
            rooms : [],          
        } 
        const resp = await axios.post('http://localhost:5000/users',userToAddToChatServer, headers);
        const userToUpdate = {username : newUser.username , password: newUser.hashedPassword, userId: resp.data._id};
        await updateUser(newUser._id, userToUpdate);
        return {accessToken : accessToken};
    }
    else{
        throw new Error('sorry we couldnt sign you up at this moment');
    }    
}

const login = async(user)=>{
    const userFromDB = await userDAL.getUserByUsername(user.username); 
    if(userFromDB && await bcrypt.compare(user.password, userFromDB.password)){
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        return {accessToken : accessToken};
    }
    else{
        return false;
    } 
}

let addUser = (user)=>{
    return userDAL.addUser(user);
}

let getUserNameById = (id)=>{
    return userDAL.getUserNameById(id);
}

let getUsers = ()=>{
    return userDAL.getUsers();
}

let updateUser = (userId,newUser)=>{
    return userDAL.updateUser(userId,newUser);
}

let deleteUser = (userId)=>{    
   return userDAL.deleteUser(userId);
}

module.exports = {login, signup, addUser, updateUser, deleteUser, getUsers, getUserNameById}
