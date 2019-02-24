const mongoose = require('mongoose');
const config = require('../config/database');

const TokenSchema = mongoose.Schema({
	"uid"   :   { type: String,  required: true },
  "email"   :   { type: String,  required: true },
  "token"   :   { type: String,  required: true }
});

const User = module.exports = mongoose.model('token', TokenSchema);
	