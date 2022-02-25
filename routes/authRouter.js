const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const client = require('../mongodb.config.js');

const run = async () => {
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		const db = client.db('bull_nice');
		const collection = db.collection('users');


        router.get('/', (req, res) => {
            res.send('Hello World!');
        });
		// Register a user
		router.post('/register', (req, res) => {
			const { email, password, name } = req.body;
			// check if user already exists
			collection.findOne({ email }, (err, user) => {
				if (err) {
					res.send(err);
				} else if (user) {
					res.send({ message: 'User already exists' });
				} else {
					// hash password
					const hashedPassword = bcrypt.hashSync(password, 10);
					// insert new user into database
					collection.insertOne(
						{
							email,
							name,
							password: hashedPassword,
						},
						(err, result) => {
							if (err) {
								res.send(err);
							} else {
								res.send({ message: 'User added successfully' });
							}
						}
					);
				}
			});
		});

		// Login a user
		router.post('/login', (req, res) => {
			const { email, password } = req.body;
			// check if user exists
			collection.findOne({ email }, (err, user) => {
				if (err) {
					res.send(err);
				} else if (!user) {
					res.send({ message: 'User does not exist' });
				} else {
					// check if password is correct
					const isPasswordCorrect = bcrypt.compareSync(password, user.password);
					if (isPasswordCorrect) {
						res.send({
							user,
							authenticated: true,
							message: 'User logged in successfully',
						});
					} else {
						res.send({ authenticated: false, message: 'Incorrect password' });
					}
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
};

run().catch(console.dir);


module.exports = router;