const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;

const usersSchema = new Schema({
	username: {
		type: String,
	},
	name: {
		type: String,
	},
	password: {
		type: String,
	},
});

const users = mongoose.model('users', usersSchema);

module.exports = users;
