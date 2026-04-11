const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, logout, getMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/*
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased limit for testing and high-traffic periods
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit headers
});
*/



const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];
// @POST /api/auth/login 
router.post('/login', loginValidation, login);

// @POST /api/auth/logout  
router.post('/logout', protect, logout);


// @GET  /api/auth/me  
router.get('/me', protect, getMe);

// @GET  /api/auth/status (alias for legacy clients)
router.get('/status', protect, getMe);

module.exports = router;
