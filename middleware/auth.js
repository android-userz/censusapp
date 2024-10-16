// middleware/auth.js
const auth = require('basic-auth');
const Admin = require('../models/Admin');

const authenticate = async (req, res, next) => {
    const credentials = auth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
        return res.status(401).json({ error: 'Access denied. Missing credentials.' });
    }

    try {
        const admin = await Admin.getAdminByUsername(credentials.name);
        if (!admin || admin.password !== credentials.pass) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        // Authentication successful
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = authenticate;
