const express = require('express');
const router = express.Router();
let { getAllUsers, getUserByName, addUser, updateUser, removeUser,login } = require('../controllers/usersController')


/**
 * @swagger
 * /visitors/login:
 *   post:
 *     parameters:
 *      - in: body
 *        name: name
 *        description: Enter Login Details
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: User logged in
 */
router.post('/login', async (req, res) => {
	let response = await login(req.body);

	if (response.success == true) {
		res.status(201).json(response);
	} else {
		res.status(404).json(response);
	}
});


/**
 * @swagger
 * /visitors:
 *   get:
 *     description: All users
 *     responses:
 *       200:
 *         description: Returns all the users
 *         schema:
            $ref: '#/users'
 */
router.get('/', async (req, res) => {
	let response = await getAllUsers(req.query.s, req.query.page, req.query.limit);
	if (response.success == true) {
		res.status(200).json(response);
	} else {
		res.status(404).json(response);
	}
});

/**
 * @swagger
 * /visitors/{name}:
 *   get:
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
router.get('/:id', async (req, res) => {
	let response = await getUserByName(req.params.name);
	res.json(response);
});

/**
 * @swagger
 * /visitors/add:
 *   post:
 *     parameters:
 *      - in: body
 *        name: name
 *        description: New name
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            name:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/add', async (req, res) => {
	let body = {
		username: req.body.username,
		name: req.body.name,
		password: req.body.password,
	};
	let response = await addUser(body);

	if (response.success == true) {
		res.status(201).json(response);
	} else {
		res.status(404).json(response);
	}
});

/**
 * @swagger
 * /visitors/{id}:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The name ID.
 *      - in: body
 *        name: name
 *        description: Update name
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            name:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.put('/:id', async (req, res) => {
	let username = null, name = null, password = null;
	if (req.body.username) {username = req.body.username}
	if (req.body.name) {name = req.body.name}
	if (req.body.password) {password = req.body.password}
	let response = await updateUser(req.params.id, username, name, password);

	if (response.success == true) {
		res.status(201).json(response);
	} else {
		res.status(404).json(response);
	}
});

/**
 * @swagger
 * /visitors/{id}:
 *   delete:
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
router.delete('/:id', async (req, res) => {
	let response = await removeUser(req.params.id)
	try {
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(response);
	}
});



module.exports = router;
