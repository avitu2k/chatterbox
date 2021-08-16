let express = require('express')
let authBL = require('../BL/authBL')
let authRouter = express.Router();

authRouter.route('/').get(async(req,res)=>{    
    try {
        let answer = await authBL.getUsers();    
        return res.json(answer);
    } catch (error) {
        res.status(500).send(); 
    }
})

authRouter.get('/:id',(req,res,next)=>{next()} ,async(req,res)=>{
    try{
        let userId = req.params.id;
        let answer = await authBL.getUserNameById(userId);
        return res.json(answer);
    } catch(err){
        res.status(500).send();
    }
})

authRouter.route('/:id').put(async(req,res)=>{
    try{
        let userId = req.params.id
        let newUser = req.body;
        let answer = await authBL.updateUser(userId,newUser);
        return res.json(answer);
    }
    catch{
        res.status(500).send();
    }
})

authRouter.route('/:id').delete(async(req,res)=>{
    try{
        let userId = req.params.id    
        let answer = await authBL.deleteUser(userId);
        return res.json(answer);
    } catch{
        res.status(500).send();
    }
})


authRouter.route('/signup').post(async(req,res)=>{
    try {
        newUser = req.body;                
        const answer = await authBL.signup(newUser);
        if(answer){
            res.json(answer); 
        }    
        else{
            res.status(403).send("couldnt sign you up , username already taken");
        }   
    }
    catch(err){
        console.log(err);
        res.status(500).send("sorry couldnt sign you up at this moment");
    }    
})

authRouter.route('/login').post(async(req,res)=>{
   try {
       const answer = await authBL.login(req.body);
       if(answer){
           res.json(answer);
       }
       else{
            res.status(400).send("username or password incorrect");
       }       
   } catch(err) {
        console.error(err);
        res.status(500).send("sorry couldnt sign you up at this moment");
   }   
})

module.exports = authRouter;