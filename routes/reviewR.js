const express = require('express');
const router = express.Router( { mergeParams: true });
const chat = require('../model/listing.js');
const expressError = require('../util/error.js');
const reviewSchema = require('../Schema.js')
const Review = require('../model/review.js');
const flash = require('connect-flash');

const validateReview = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el) =>  el.message).join(',');
      throw new expressError(400,errmsg);
    }else{
      next();
    }
  };
  
//reviews routes
//router.post('/explore/:id/reviews', async(req, res) => {
router.post('/', async(req, res) => {
    let list = await chat.findById(req.params.id);
    let { rating ,comment,createAt } = req.body;
    let newReview = await Review({
     rating,
     comment,
     createAt,
    });

    newReview.author = req.user._id;

    console.log(newReview);

    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
   console.log("newReview saved successfully")
   // res.send("NewReview saved successfully ")
   req.flash("success","Add Review  successfully");
   res.redirect(`/explore/${list._id}`)
   });
   
   // Review delete
   // router.delete('/explore/:id/reviews/:reviewId', async(req, res) => {
   router.delete('/:reviewId', async(req, res) => {
    let list = await chat.findById(req.params.id);
    let review = await Review.findByIdAndDelete(req.params.reviewId);
    list.reviews.pull(review);
    await list.save();
    console.log("Review deleted successfully")
    req.flash("success","Deltele Review successfully");
    res.redirect(`/explore/${list._id}`)
   });

   module.exports = router;