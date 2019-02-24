const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	"name"   :   { type: String},
  "username"   :   { type: String},
  "password"   :   { type: String },
	"email"   :   { type: String, },
	"role"   :   [
		{
			"role_id" : {type:String},
			"role_name": {type:String}
		}
	],
	"status"   :   { type: Boolean,  default: true }
});


const User = module.exports = mongoose.model('users', UserSchema);
  
  module.exports.comparePassword = function(candidatePassword, hash, callback) {
	  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) console.log(err);
		callback(null, isMatch);
	  });
	}

	module.exports.UpdateUser = function(username, password, callback) {
	  bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if(err) console.log(err);
				password = hash;
				User.findOneAndUpdate({username : username}, { $set: { password: password }}, function (err, data) {
					if (err) return handleError(err);
					callback(null, data);
				});
			});
		});
	}
	