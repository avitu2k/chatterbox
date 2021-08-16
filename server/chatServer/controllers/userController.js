let express = require('express')
let userBL = require('../BL/userBL')
let userRouter = express.Router();

userRouter.route('/').get(async(req,resp)=>{    
    var answer = await userBL.getAllUsers();    
    return resp.json(answer);
})

userRouter.route('/current').get(async(req,resp)=>{ 
    try{
        let answer = await userBL.getUserByName(req.username);   
        if(answer){
            return resp.json(answer);
        }
        else{
            resp.status(400).send('couldnt fetch user data from token');
        }
    }
    catch(err){
        resp.status(500).send();    
    }
})

userRouter.route('/:id').get(async(req,resp)=>{
    let userId = req.params.id;
    var answer = await userBL.getUserById(userId);
    return resp.json(answer);
})

userRouter.route('/').post(async(req,resp)=>{
    let newUser = req.body;
    let answer = await userBL.addUser(newUser);
    return resp.json(answer);
})

userRouter.route('/:id').put(async(req,resp)=>{
    let userId = req.params.id
    let newUser = req.body;
    let answer = await userBL.updateUser(userId,newUser);
    return resp.json(answer);
})

userRouter.route('/:id').delete(async(req,resp)=>{
    let userId = req.params.id    
    let answer = await userBL.deleteUser(userId);
    return resp.json(answer);
})



module.exports = userRouter;