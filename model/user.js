const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name:{
      type : 'string',
    },
    username:{
      type : String,
    },
    email: {
      type : String,
      required : true,
    //   unique : true,
    //   lowercase : true,
    //   match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    }
})
userSchema.plugin(passportLocalMongoose);

const userlist = mongoose.model('userlist', userSchema);
module.exports = userlist ;