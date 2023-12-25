const express = require('express');
const router = express.Router();
let { getAllUsers, getUserByName, addUser, updateUser, removeUser,login } = require('../controllers/usersController')
let {generateToken, verifyToken, errorMessage} = require('../controllers/tokenAPI');

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *     - Login
 *     requestBody:
 *      description: User login information
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: User logged in
 */
router.post('/login', async (req, res) => {
    let data = req.body
    let result = await login(data);
    const loginuser = result.verify
    const token = result.token
    //check the returned result if its a object, only then can we welcome the user
    if (typeof loginuser == "object") { 
		res.status(200).send( "Welcome " + loginuser.name +"! Have a nice day" + "\nYour token : " + token);
    }else {
      //else send the failure message
      res.send(errorMessage() + result)
    }
  });

/**
 * @swagger
 * /users/listUsers:
 *   get:
 *     tags:
 *     - Manage Users
 *     security:
 *     - jwtToken: []
 *     description: All users
 *     responses:
 *       200:
 *         description: Returns all the users
 *         schema:
            $ref: '#/users'
 */
router.get('/listUsers',verifyToken, async (req, res) => {
	let response = await getAllUsers(req.query.s, req.query.page, req.query.limit);
	if (response.success == true) {
		res.status(200).json(response);
	} else {
		res.status(404).json(response);
	}
});

/**
 * @swagger
 * /users/search/{name}:
 *   get:
 *     tags:
 *     - Manage Users
 *     security:
 *     - jwtToken: []
 *     parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        type: string
 *        description: The name .
 *     description: Get a user info by name
 *     responses:
 *       200:
 *         description: Returns the requested name
 */
router.get('/search/:id',verifyToken, async (req, res) => {
	let response = await getUserByName(req.params.name);
	res.json(response);
});

/**
 * @swagger
 * /users/add:
 *   post:
 *     tags:
 *     - Manage Users
 *     security:
 *     - jwtToken: []
 *     requestBody:
 *      description: User login information
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: string
 *            password:
 *              type: string
 *            name:
 *              type: string
 *            unit:
 *              type: string
 *            hp_num:
 *              type: string
 *            role:
 *              type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/add',verifyToken, async (req, res) => {
	let authorize = req.user.role //reading the token for authorisation
	let data = req.body //requesting the data from body
	//checking the role of user
	if (authorize == "security" || authorize == "resident"){
	  res.send("you do not have access to registering users!")
	}else if (authorize == "admin" ){
	  const newUser = await addUser(data)
	  if (newUser){ //checking is registration is succesful
		res.status(201).send("Registration request processed, new user is " + newUser.name)
	  }else{
		res.send("User already exists!")
	  }
	//token does not exist
	}else {
		res.send("Token not valid!")
	  }
	});

/**
 * @swagger
 * /users/update:
 *   patch:
 *     tags:
 *     - Manage Users
 *     security:
 *     - jwtToken: []
 *     requestBody:
 *      description: User login information
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            user_id:
 *              type: string
 *            password:
 *              type: string
 *            name:
 *              type: string
 *            unit:
 *              type: string
 *            hp_num:
 *              type: string
 *            role:
 *              type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.put('/update',verifyToken, async (req, res) => {
	let authorize = req.user.role //reading the token for authorisation
	let data = req.body //requesting the data from body
	//checking the role of user
	if (authorize == "security" || authorize == "resident"){
	  res.send("you do not have access to update user information!")
	}else if (authorize == "admin" ){
	  const result = await updateUser(data)
	  if (result){ // checking if the user exist and updated
		res.send("User updated! " + result.value.name)
	  }else{
		res.send(errorMessage() + "User does not exist!")
	  }
	}else {
		res.send(errorMessage() + "Token is not found!")
	  }
  });

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     tags:
 *     - Manage Users
 *     security:
 *     - jwtToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The name ID.
 *     description: Delete a name by id
 *     responses:
 *       200:
 *         description: Returns the requested catachphrase
 */
router.delete('/delete/:id',verifyToken, async (req, res) => {
	let response = await removeUser(req.params.id)
	try {
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(response);
	}
});



module.exports = router;
