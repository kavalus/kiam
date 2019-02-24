const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	"name": { type: String, required: true },
	"username": { type: String, required: true, unique: true },
	"password": { type: String },
	"email": { type: String },
	"user_type": { type: String, required: true },
	"role": [
		{
			"role_id": { type: String },
			"role_name": { type: String }
		}
	],
	"status": { type: Boolean, default: true },
	// "mobile_no": { type: String}
});


const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
	const query = { username: username, status: true }
	User.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) console.log(err);
		callback(null, isMatch);
	});
}

module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) console.log(err);
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.changePassword = function (data, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(data.password, salt, (err, hash) => {
			if (err) console.log(err);
			data.password = hash;
			User.findByIdAndUpdate(data.id, { $set: { password: data.password } }, function (err, data) {
				if (err) return handleError(err);
				callback(null, data);
			});
		});
	});
}

module.exports.UpdateUser = function (id, UpdateUser, callback) {
	if (UpdateUser.password == (null || undefined || '')) {
		delete UpdateUser['password'];
		console.log(UpdateUser);
		User.findByIdAndUpdate(id, { $set: UpdateUser }, function (err, data) {
			if (err) return handleError(err);
			callback(null, data);
		});
	} else {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(UpdateUser.password, salt, (err, hash) => {
				if (err) console.log(err);
				UpdateUser.password = hash;
				User.findByIdAndUpdate(id, UpdateUser, function (err, data) {
					if (err) return handleError(err);
					callback(null, data);
				});
			});
		});
	}
}
