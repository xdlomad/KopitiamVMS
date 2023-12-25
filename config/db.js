const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect('mongodb+srv://b022110096:l8y6PQc3ylvAL1oe@firstdatabase.3xnid7z.mongodb.net/EmeraldVMS', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;
