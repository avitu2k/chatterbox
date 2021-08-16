var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatAuth',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})