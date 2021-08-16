var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-avi:aviavi123@cluster0.ydiex.mongodb.net/chatDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})