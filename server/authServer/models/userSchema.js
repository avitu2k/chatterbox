let mongoose = require('mongoose')
let appSchema = mongoose.Schema

var userSchema = appSchema(
    {
        "username" : String,        
        "password" : String,
        "userId" : String,             
    }
)

module.exports = mongoose.model('users',userSchema);