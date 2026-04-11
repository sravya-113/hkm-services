const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const logger = require('../utils/logger');


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d',
    });
};


const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        },
    });
};


const bcrypt = require('bcryptjs');

/**
 * @desc    Login user (Allows Admin & Users)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = (process.env.ADMIN_EMAIL || 'mukunda@hkmvizag.org').toLowerCase();
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    if (email.toLowerCase() !== adminEmail) {
        return res.status(401).json({ success: false, message: 'Access denied. Unauthorized email.' });
    }

    try {
        // Compare with environment hash
        const isMatch = await bcrypt.compare(password, adminHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Password mismatch.' });
        }

        // Ensure Admin exists in Database for record relations (e.g. createdBy fields)
        let user = await User.findOne({ email: adminEmail });
        
        if (!user) {
            user = await User.create({
                name: 'Administrator',
                email: adminEmail,
                password: 'SYSTEM_ADMIN_ACCOUNT', // Not used for login
                role: 'admin',
                isActive: true
            });
        }

        sendTokenResponse(user, 200, res, 'Login successful. Welcome, Admin.');
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
};

const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: `Goodbye, Admin! You have been logged out successfully.`,
        token: null,
    });
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    res.status(403).json({
        success: false,
        message: 'Password recovery is disabled for the admin account. Please check your environment configuration.',
    });
};

module.exports = { login, logout, getMe, forgotPassword };
