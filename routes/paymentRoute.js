const express = require('express');
const router = express.Router();
const client = require('../mongodb.config.js');

// import mollie api client
const { createMollieClient } = require('@mollie/api-client');

// create client with api key
const mollieClient = createMollieClient({
	apiKey: process.env.MOLLIE_API_KEY,
});

const run = async () => {
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		const db = client.db('bull_nice');
		const collection = db.collection('orders');

		let something;

		// Initialize the routes
		router.post('/', async (req, res) => {
			try {
				const info = req.body;
				const amount =
					info.payment?.amount -
					(info.payment?.amount / 100) * info.payment?.save;
				// Get the payment
				const payment = await mollieClient.payments.create({
					amount: {
						value: String(amount.toFixed(2)),
						currency: 'USD',
					},
					description: `You ordered ${info.payment?.product} for ${info.payment?.amount} USD with ${info.payment?.save}% discount`,
					redirectUrl: 'https://bullnice-5bf69.web.app/payment-success',
					webhookUrl: 'https://yourwebshop.example.org/webhook',
				});
				something = payment;
				// Send the payment object as JSON
				res.json(payment);
			} catch (error) {
				// Handle error
				console.error(error);
			}
		});

		router.get('/success', async (req, res) => {
			if (something) {
				try {
					// Get the payment
					const payment = await mollieClient.payments.get(something.id);
					// Send the payment object as JSON
					res.json(payment);
				} catch (error) {
					// Handle error
					console.error(error);
				}
			} else {
				res.json({
					error: 'Something went wrong',
				});
			}
		});
	} catch (err) {
		console.log(err);
	}
};

run().catch(console.dir);

module.exports = router;
