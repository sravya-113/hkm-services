const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
 * @desc    Login user (Admin only)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Enforce Admin Email Only
    const adminEmail = process.env.ADMIN_EMAIL || 'mukunda@hkmvizag.org';
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only the administrator can log in.',
        });
    }

    try {
        // 2. Resolve Admin from DB (to keep IDs and Roles consistent across the app)
        let user = await User.findOne({ email: adminEmail }).select('+password');

        // If admin doesn't exist in DB yet, bootstrap them (initial login)
        if (!user) {
            // Check against ADMIN_PASSWORD_HASH if provided, else we can't bootstrap
            // For first-time setup, we allow login if password matches the hash in ENV
            const adminHash = process.env.ADMIN_PASSWORD_HASH;
            
            if (adminHash) {
                const isMatch = await bcrypt.compare(password, adminHash);
                if (isMatch) {
                    // Create the admin user in the database so the rest of the app works
                    user = await User.create({
                        name: 'Administrator',
                        email: adminEmail,
                        password: password, // Will be hashed by User model pre-save hook
                        role: 'admin',
                        isActive: true
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials.',
                    });
                }
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Admin account not found and bootstrap credentials missing.',
                });
            }
        } else {
            // Normal password check against DB
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials.',
                });
            }
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Admin account is deactivated.',
            });
        }

        sendTokenResponse(user, 200, res, 'Login successful.');
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
};


const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: `Goodbye, ${req.user.name}! You have been logged out successfully.`,
        token: null,
    });
};


const getMe = async (req, res) => {
    
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    });
};

module.exports = { register, login, logout, getMe };
