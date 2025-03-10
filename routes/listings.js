const express = require('express');
const router = express.Router({mergeParams: true });
const chat = require('../model/listing.js');
const expressError = require('../util/error.js');
const listSchema  = require('../Schema.js');
const Review = require('../model/review.js');
const flash = require('connect-flash');
const loggedMiddle = require('../loggedMidlware.js');

const { storage } = require('../cloud.js');
//multer is used to stored data in file format
const multer  = require('multer')
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })

router.use('/uploads', express.static('uploads'));

router.use(express.json());  // This middleware parses JSON requests
router.use(express.urlencoded({ extended: true })); // This parses URL-encoded form data

const validateListing = (req,res,next) => {
    let {error} = listSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el) =>  el.message).join(',');
      throw new expressError(400,errmsg);
    }else{  
      next();
    }
  };
  
//   router.get('/explore', async (req, res, next) => {
router.get('/',async (req, res, next) => {
    try {
      const searchQuery = req.query.search || '';  // Get search query from the URL
      const items = await chat.find({
        title: { $regex: searchQuery, $options: 'i' }  // Perform case-insensitive search
      });
      let infoData = await chat.find();
      res.render('index.ejs', { infoData ,items,searchQuery});
    } catch (err) {
      next(err);
    }
  });
  
//   router.get('/explore/new', async(req, res, next) => {
  router.get('/new',loggedMiddle,validateListing, async(req, res, next) => {
    res.render('new.ejs');
  });
  
  //Create a new list
  router.post('/',upload.single('image.url'),async(req, res, next) => {
    try {
      const url = req.file.path;
      const filename = req.file.filename;

      const newChat = new chat(req.body);
      
      newChat.owner = req.user._id;
      newChat.image = { filename, url };
      
      const chatsave = await newChat.save();

      req.flash("success","new list added successfully");
      res.redirect('/explore');
    } catch (err) {
      next(err);
    }
  });

 
  router.get('/:id', async (req, res, next) => {
    try {
      let { id } = req.params;
      //const listing = await chat.findById(id).populate("reviews").populate("owner");
     const listing = await chat.findById(id).populate({path: "reviews",populate: { path: "author"} }).populate("owner");
      
      console.log(listing);
      if (!listing) {
        req.flash("error","Lst is does not exist");
        return res.redirect('/explore');
      }
      res.render('show.ejs', { listing : listing });
    } catch (err) {
      next(err);
    }
  });
  
  // Edit a list
  router.get('/:id/edit',async(req, res, next) => {
    try {
      let { id } = req.params;
      const editlist = await chat.findById(id);
      if (!editlist) {
        return next(new expressError(404, 'Page Not Found'));
      }
      res.render('edit.ejs', { editlist });
    } catch (err) {
      next(err);
    }
  });
  
  // Update a list
  router.patch('/:id',upload.single('image.url'),async (req, res, next) => {
    try {
      let { id } = req.params;
      let { title, description,image, price, location, country } = req.body;
      const update = await chat.findByIdAndUpdate(id, { ...req.body.chat });

       if(typeof req.file !== 'undefined'){
        const url = req.file.path;
        const filename = req.file.filename;
         update.image = { url , filename };
         const updateSave= await update.save();
         console.log(updateSave);
        }

      if (!update) {
        return next(new expressError(404, 'Page Not Found'));
      }
      req.flash("success","Edit list successfully");
      res.redirect(`/explore/${id}`);
    } catch (err) {
      next(err);
    }
  });
  
  // Delete a list
  router.delete('/:id', async (req, res, next) => {
    try {
      let { id } = req.params;
      const deletelist = await chat.findByIdAndDelete(id);
      if (!deletelist) {
        return next(new expressError(404, 'Page Not Found'));
      }
      req.flash("success","Deleted list successfully");
      res.redirect(`/explore`);
    } catch (err) {
      next(err);
    }
  });


module.exports = router ;