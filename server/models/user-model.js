const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
	name:{type:String},
	mobile:{type:Number},
	dob:{type:String},
	email: {type: String},
	password:{type:String},

});



module.exports = mongoose.model('User', userSchema);