const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;

const usersSchema = new Schema({
	user_id: {
		type: String,
	},
	name: {
		type: String,
	},
	password: {
		type: String,
	},
	unit: {
		type: String,
	},
	hp_num: {
		type: String,
	},
	role: {
		type: String,
	}
});

usersSchema.set('toObject', { virtuals: true })

const users = mongoose.model('users', usersSchema);

module.exports = users;
