const Joi = require('joi')

//Joi npm pakage use for  server side schema validation

const listSchema = Joi.object({
    title: Joi.string().min(4).max(60),
    description: Joi.string().min(5).max(100).required(),
    price: Joi.number().required(),
    location: Joi.string().min(1).max(30).required(),
    country: Joi.string().min(1).max(30).required(),
    image: {
        filename : Joi.string().allow('' , null),  //allow empty string or null for filename
        url :Joi.string().allow('' , null)
    } //add image validation in future if needed  //not added here for simplicity
});
module.exports = listSchema;

const reviewSchema = Joi.object({
      reviews : Joi.object({
        rating : Joi.number().required(),
        comment : Joi.string().required()
    })
})
module.exports = reviewSchema;
