// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const participantsRouter = require('./routes/participants');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Optional: Set up EJS for views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/participants', participantsRouter);

// Optional: Basic views routes
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
