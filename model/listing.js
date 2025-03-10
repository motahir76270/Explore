const mongoose = require('mongoose')
const review = require('./review.js');
const { string } = require('joi');
const  userlist  = require('./user.js');
const passportLocalMongoose = require('passport-local-mongoose');

const sampledata = new mongoose.Schema( {
    title :{ type: 'string',
        
    },
    description : {
        type : String,
        minlength : 10,
        maxlength : 500,
    },
    image : {
        filename : String,
        url : String,
        
    },
    price : {type : String, 
    },
    location :{
        type : String,
        
    } ,
    country : {
        type: String,
    },
    reviews : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'review'
        },
    ],
    owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'userlist' 
    },
    ]
});

sampledata.post("findOneAndDelete" , async(chat) => {
    if(chat) {
        await review.deleteMany({_id : {$in : chat.reviews}});
    }
})

const chat = mongoose.model('chat' , sampledata);


module.exports = chat;