const user = require('../models/users');
const bcrypt = require('bcrypt');

const saltRounds = 10;
let {generateToken, verifyToken, errorMessage} = require('./tokenAPI');

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

async function addUser(newdata) {
	const match = await user.findOne({user_id : newdata.user_id});
    if (match) {
      return 
    } else {
      //encrypt password by hashing
      newdata.password = await encryption(newdata.password)
      // add info into database
	  console.log(newdata)
	  const newData = new user(newdata)
	  console.log(newData)
	  await newData.save();
  const newUser=await user.findOne({user_id : newData.user_id})
  return (newUser)
}}

async function updateUser(id, username = null, name = null, password = null) {
	if (data.password){
		data.password = await encryption(data.password) //encrypt the password
		}
		result = await user.findOneAndUpdate({user_id : data.user_id},{$set : data}, {new: true})
		if(result.value == null){ //check if user exist
		  return 
		}else{
		  return (result)
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
	console.log("Alert! Alert! Someone is logging in!") //Display message to ensure function is called
	//Verify username is in the database
	let verify = await user.findOne({user_id : data.user_id}, "-hp_num");
	var convertedJSON = JSON.parse(JSON.stringify(verify));
	if (verify){
	  //verify password is correct
	  const correctPassword = await bcrypt.compare(data.password,verify.password);
	  if (correctPassword){
		token = generateToken(convertedJSON)
		return{verify,token};
	  }else{
		return ("Wrong password D: Forgotten your password?")
	  }
	}else{
	  return ("No such user ID found D:")
  }};

  //bcrypt functions to generate a hashed password
async function encryption(data){
	const salt= await bcrypt.genSalt(saltRounds)
	const hashh = await bcrypt.hash(data,salt)
	return hashh
  }

module.exports = {
	getAllUsers,
	getUserByName,
	addUser,
	updateUser,
	removeUser,
	login
}
