require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.json());

const Participant = require('./models/Participant'); // Adjust the path if necessary


// Basic Authentication Middleware
const authMiddleware = (req, res, next) => {
    const auth = { login: 'admin', password: 'P4ssword' }; // Change these based on .env if necessary

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"'); // show login dialog
    res.status(401).send('Authentication required.'); // Access denied
};

// Use authentication middleware for all routes
app.use(authMiddleware);

// MySQL connection setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Routes
app.get('/', (req, res) => {
    res.render('index'); 
});

// Route to render the form to add participants (for simplicity)
app.get('/participants/view/add', (req, res) => {
    res.render('addParticipant');  // Render a form (addParticipant.ejs)
});

// Route to add participants
app.post('/participants/add', async (req, res) => {
    const { email, firstname, lastname, dob, companyname, salary, currency, country, city } = req.body;

    // Validate input data
    //if (!email || !firstname || !lastname || !dob || !companyname || !salary || !currency || !country || !city) {
        //return res.status(400).json({ error: 'All fields are required.' });
    //}

    try {
        // Create a new participant
        await Participant.addParticipant({ 
            email, 
            firstname, 
            lastname, 
            dob, 
            companyname, 
            salary, 
            currency, 
            country, 
            city 
        });
        res.redirect('/participant/view/list'); // Redirect to list of participants after adding
    } catch (error) {
        // Return a specific error message if the participant creation fails
        res.status(400).json({ error: `Error adding participant: ${error.message}` });
    }
});


// Route to list all participants
app.get('/participants/view/list', async (req, res) => {
    const participants = await Participant.findAll();  // Assuming you're using Sequelize or similar ORM
    res.render('listParticipants', { participants });
});


// Define other routes (e.g., participants/add, participants/details/:email, etc.)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
