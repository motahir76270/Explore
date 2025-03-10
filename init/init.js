const mongoose = require('mongoose')
const initdata = require('./data.js')
const chat = require('../model/listing.js')
main()
.then( () => {
     console.log('Connected to MongoDB!')
 
}).catch( (err) => {
    console.log('Error connecting', err) 
});

async function main()  {
 await mongoose.connect('mongodb://localhost:27017/explore')  
}

const initdatbase = async function (){
    await chat.deleteMany({})
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '67adad110196d5e57af9497d'}));
    await chat.insertMany(initdata.data)
    console.log('Database initialized with sample data')
}
initdatbase();
