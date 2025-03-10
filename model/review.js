const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const reviewSchema = new Schema ( {
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    createAt : {
        type : Date,
        default : Date.now()
    },
    author :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userlist'  
    }
})

const review = mongoose.model('review' , reviewSchema)

module.exports = review ;