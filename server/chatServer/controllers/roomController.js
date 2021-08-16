let express = require('express')
let roomBL = require('../BL/roomBL')
let roomRouter = express.Router();

roomRouter.route('/').get(async(req,resp)=>{    
    var answer = await roomBL.getAllRooms();    
    return resp.json(answer);
})

roomRouter.route('/:id').get(async(req,resp)=>{
    let roomId = req.params.id;
    var answer = await roomBL.getRoomById(roomId);
    return resp.json(answer);
})

roomRouter.route('/').post(async(req,resp)=>{
    let newRoom = req.body;
    let answer = await roomBL.addRoom(newRoom);
    return resp.json(answer);
})

roomRouter.route('/:id').put(async(req,resp)=>{
    let roomId = req.params.id
    let newRoom = req.body;
    let answer = await roomBL.updateRoom(roomId,newRoom);
    return resp.json(answer);
})

roomRouter.route('/:id').delete(async(req,resp)=>{
    let roomId = req.params.id    
    let answer = await roomBL.deleteRoom(roomId);
    return resp.json(answer);
})



module.exports = roomRouter;