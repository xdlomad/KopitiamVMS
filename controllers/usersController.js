const user = require('../models/users');
let {generateToken, verifyToken} = require('./tokenAPI');

async function getAllUsers(search, reqPage, reqLimit) {
	let options = {};

	if (search) {
		options = {
			...options,
			$or: [
				{username: new RegExp(search.toString(), 'i')},
				{name: new RegExp(search.toString(), 'i')}
			]
		}
	}

	let total = user.countDocuments(options);
	let page = parseInt(reqPage) || 1;
	let limit = parseInt(reqLimit) || parseInt(await total);
	let last_page = Math.ceil(parseInt(await total)/limit);
	if (last_page < 1 && total > 0) {
		last_page = 1
	}

	try {
		const result = await user.find(options).skip((page - 1) * limit).limit(limit);
		return {
			success: true,
			data: result,
			total: (await total).toString(),
			page: (await page).toString(),
			last_page: (await last_page).toString(),
		};
	} catch (err) {
		return { success: false, message: "Users not found" };
	}
}

async function getUserByName(searchedName) {
	let search;
	try {
		search = await user.findOne(searchedName);
		if (search == null) {
			return { success: false, message: 'Cannot find users' };
		}
	} catch (err) {
		return { success: false, message: err.message };
	}

	return {
		success: true,
		data: search,
	};
}

async function addUser(body) {
	const newData = new user(body);

	try {
		const newUser = await newData.save();
		return {
			success: true,
			data: newUser,
		};
	} catch (err) {
		return { success: false, message: "Failed to add user" };
	}
}

async function updateUser(id, username = null, name = null, password = null) {
	let result;
	try {
		result = await user.findById(id);
		if (result == null) {
			return { success: false, message: 'Cannot find user' };
		}
		if (username != null) {
			result.username = username
		}
		if (name != null) {
			result.name = name
		}
		if (password != null) {
			result.password = password
		}

		try {
			const updatedUser = await result.save()
			return {
				success: true,
				data: updatedUser,
				message: "user updated successfully"
			};
		} catch (err) {
			return { sucess: false ,message: "Failed to update user" };
		}
	} catch (err) {
		return { success: false, message: err.message };
	}
}

async function removeUser(id) {
	let search;
	try {
		search = await user.findById(id);
		if (search == null) {
			return { success: false, message: 'Cannot find user' };
		}

		try {
			await search.remove()
			return {
				success: true,
				message: 'Deleted user'
			};
		} catch (err) {
			return { success: false ,message: err.message };
		}
	} catch (err) {
		return { success: false, message: err.message };
	}
}

async function login(data) {
	let search;
	try {
		search = await user.findOne(data);
		if (search == null) {
			return { success: false, message: 'Cannot find users' };
		}
	} catch (err) {
		return { success: false, message: err.message };
	}
	let token  = generateToken(data);
	return {
		success: true,
		token : token,
		data: search,
	};
}


module.exports = {
	getAllUsers,
	getUserByName,
	addUser,
	updateUser,
	removeUser,
	login
}
