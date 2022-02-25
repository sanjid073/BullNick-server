// import required modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();



// Initialize the app
const app = express();
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Define routes
const authRoute = require('./routes/authRouter');
const paymentRoute = require('./routes/paymentRoute');

// Application routes
app.use('/auth', authRoute);
app.use('/payment', paymentRoute);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
