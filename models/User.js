// we are going to define user schema using mongoose ODM. 
// It allows us to retrieve the data from the database. 
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// Models(Kittens) -> Shema(name: string)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
   name:{
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
},{
   timestamps: true,
   collection: 'users'
})
module.exports = mongoose.model('User', userSchema);