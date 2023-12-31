const express = require('express');
const router = express.Router();
let { getAllUsers, getUserByName, addUser, updateUser, removeUser,login } = require('../controllers/usersController')
let {generateToken, verifyToken} = require('../controllers/tokenAPI');

/**
 * @swagger
 * tags:
  - name: Visitors
    description: Operations related to managing visitors
 */

/**
 * @swagger
 * /visitor:
 *   get:
 *     tags:
 *     - Manage Visitors
 *     security:
 *     - jwtToken: []
 *     description: All users
 *     responses:
 *       200:
 *         description: Returns all the users
 *         schema:
            $ref: '#/users'
 */
router.get('/',verifyToken, async (req, res) => {
	let response = await getAllUsers(req.query.s, req.query.page, req.query.limit);
	if (response.success == true) {
		res.status(200).json(response);
	} else {
		res.status(404).json(response);
	}
});

/**
 * @swagger
 * /visitor/{name}:
 *   get:
 *     tags:
 *     - Manage Visitors
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
 * /visitor/add:
 *   post:
 *     tags:
 *     - Manage Visitors
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
 * /visitor/update:
 *   patch:
 *     tags:
 *     - Manage Visitors
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
router.put('/update', async (req, res) => {
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
 * /vistor/delete/{id}:
 *   delete:
 *     tags:
 *     - Manage Visitors
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
router.delete('/delete/:id', async (req, res) => {
	let response = await removeUser(req.params.id)
	try {
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(response);
	}
});



module.exports = router;
