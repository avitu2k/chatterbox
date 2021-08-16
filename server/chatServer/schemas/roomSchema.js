let mongoose = require('mongoose')
let appSchema = mongoose.Schema

var roomSchema = appSchema(
    {
        "name" : String ,
        "members" : [{"memberId" : String, "memberName" : String}] ,        
        "isGroup" : Boolean,   
        "admins" : [String],
        "messages":[
            {
                "fromId": String,
                "toId": String,
                "body": String,
                "created" : Date,
                "deliveredTo" : [String], 
                "readBy" : [String],
                "deliveredToAll" : Boolean,
                "readByAll" : Boolean,
            }
           ], 
        "lastModified": Date,                 
    }
)

module.exports = mongoose.model('rooms',roomSchema);