var userModel = require('../models/user-model');
let usercontroller = {};

usercontroller.add = function(req,res){

	var user = new userModel(req.body);
	user.save(function(err,user){
		console.log(err,user);
		res.status(200).send(user);
	})
	console.log(req.body);
}

usercontroller.get= function(req,res){
	userModel.find( { }, function (err, foundUser) {
		if (err){
			return next(err);
		}
		console.log("found SUer ===>" , foundUser);
		res.status(200).send(foundUser);

	})
}
usercontroller.getById=function(req,res){

	userModel.findOne({_id: req.params.id},function(err,foundUser)
	{
		res.status(200).send(foundUser);
	})
}

usercontroller.delete = function(req,res){


	userModel.findByIdAndRemove({_id: req.params.id},function(err,duser){
		console.log(err,duser);
		res.status(200).send(duser);
	})
}

usercontroller.update = function(req,res){


	userModel.findByIdAndUpdate({_id: req.params.id},req.body,{upsert:true},function(err,uuser){
		console.log(uuser);
		res.status(200).send(uuser);
	})
}

module.exports = usercontroller;