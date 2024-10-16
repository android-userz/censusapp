// routes/participants.js
const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const authenticate = require('../middleware/auth');
const { participantValidationRules, validate } = require('../middleware/validate');

// Apply authentication middleware to all routes in this router
router.use(authenticate);

/**
 * @route   POST /participants/add
 * @desc    Add a new participant
 */
router.post('/add', participantValidationRules(), validate, async (req, res) => {
    try {
        const participant = req.body;
        await Participant.addParticipant(participant);
        res.status(201).json({ message: 'Participant added successfully.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Participant with this email already exists.' });
        } else {
            console.error('Error adding participant:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
});

/**
 * @route   GET /participants
 * @desc    Get all participants
 */
router.get('/', async (req, res) => {
    try {
        const participants = await Participant.getAllParticipants();
        res.json({ participants });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   GET /participants/details
 * @desc    Get personal details of all participants
 */
router.get('/details', async (req, res) => {
    try {
        const details = await Participant.getParticipantPersonalDetails();
        res.json({ details });
    } catch (error) {
        console.error('Error fetching participant details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   GET /participants/details/:email
 * @desc    Get personal details of a specific participant
 */
router.get('/details/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const details = await Participant.getParticipantDetails(email);
        if (!details) {
            return res.status(404).json({ error: 'Participant not found.' });
        }
        res.json({ details });
    } catch (error) {
        console.error('Error fetching participant details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   GET /participants/work/:email
 * @desc    Get work details of a specific participant
 */
router.get('/work/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const workDetails = await Participant.getParticipantWorkDetails(email);
        if (!workDetails) {
            return res.status(404).json({ error: 'Participant not found.' });
        }
        res.json({ work: workDetails });
    } catch (error) {
        console.error('Error fetching work details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   GET /participants/home/:email
 * @desc    Get home details of a specific participant
 */
router.get('/home/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const homeDetails = await Participant.getParticipantHomeDetails(email);
        if (!homeDetails) {
            return res.status(404).json({ error: 'Participant not found.' });
        }
        res.json({ home: homeDetails });
    } catch (error) {
        console.error('Error fetching home details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   DELETE /participants/:email
 * @desc    Delete a participant by email
 */
router.delete('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        await Participant.deleteParticipant(email);
        res.json({ message: 'Participant deleted successfully.' });
    } catch (error) {
        console.error('Error deleting participant:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * @route   PUT /participants/:email
 * @desc    Update a participant by email
 */
router.put('/:email', participantValidationRules(), validate, async (req, res) => {
    try {
        const email = req.params.email;
        const participant = req.body;
        await Participant.updateParticipant(email, participant);
        res.json({ message: 'Participant updated successfully.' });
    } catch (error) {
        console.error('Error updating participant:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
