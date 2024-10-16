// models/Participant.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const addParticipant = async (participant) => {
    const query = `
        INSERT INTO participants 
        (email, firstname, lastname, dob, companyname, salary, currency, country, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        participant.email,
        participant.firstname,
        participant.lastname,
        participant.dob,
        participant.work.companyname,
        participant.work.salary,
        participant.work.currency,
        participant.home.country,
        participant.home.city
    ];
    await pool.query(query, params);
};

const getAllParticipants = async () => {
    const [rows] = await pool.query('SELECT * FROM participants');
    return rows;
};

const getParticipantDetails = async (email) => {
    const [rows] = await pool.query('SELECT firstname, lastname, email FROM participants WHERE email = ?', [email]);
    return rows[0];
};

const getParticipantPersonalDetails = async () => {
    const [rows] = await pool.query('SELECT firstname, lastname, email FROM participants');
    return rows;
};

const getParticipantWorkDetails = async (email) => {
    const [rows] = await pool.query('SELECT companyname, salary, currency FROM participants WHERE email = ?', [email]);
    return rows[0];
};

const getParticipantHomeDetails = async (email) => {
    const [rows] = await pool.query('SELECT country, city FROM participants WHERE email = ?', [email]);
    return rows[0];
};

const deleteParticipant = async (email) => {
    await pool.query('DELETE FROM participants WHERE email = ?', [email]);
};

const updateParticipant = async (email, participant) => {
    const query = `
        UPDATE participants SET 
            firstname = ?, 
            lastname = ?, 
            dob = ?, 
            companyname = ?, 
            salary = ?, 
            currency = ?, 
            country = ?, 
            city = ?
        WHERE email = ?
    `;
    const params = [
        participant.firstname,
        participant.lastname,
        participant.dob,
        participant.work.companyname,
        participant.work.salary,
        participant.work.currency,
        participant.home.country,
        participant.home.city,
        email
    ];
    await pool.query(query, params);
};

module.exports = {
    addParticipant,
    getAllParticipants,
    getParticipantDetails,
    getParticipantPersonalDetails,
    getParticipantWorkDetails,
    getParticipantHomeDetails,
    deleteParticipant,
    updateParticipant
};
