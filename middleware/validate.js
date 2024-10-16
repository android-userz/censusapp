// middleware/validate.js
const { body, validationResult } = require('express-validator');

const participantValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email format.'),
        body('firstname').notEmpty().withMessage('First name is required.'),
        body('lastname').notEmpty().withMessage('Last name is required.'),
        body('dob').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('DOB must be in YYYY-MM-DD format.'),
        body('work.companyname').notEmpty().withMessage('Company name is required.'),
        body('work.salary').isNumeric().withMessage('Salary must be a number.'),
        body('work.currency').notEmpty().withMessage('Currency is required.'),
        body('home.country').notEmpty().withMessage('Country is required.'),
        body('home.city').notEmpty().withMessage('City is required.')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({
        errors: extractedErrors,
    });
};

module.exports = {
    participantValidationRules,
    validate,
};
