let mongoose = require('mongoose')
let appSchema = mongoose.Schema

var userSchema = appSchema(
    {
        "name" : String ,
        "blocked" : [String] ,        
        "rooms" : [String],             
    }
)

module.exports = mongoose.model('users',userSchema);