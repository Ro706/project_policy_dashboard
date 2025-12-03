const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get Dashboard Stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const feedbackCount = await Feedback.countDocuments();
        const payments = await Payment.find().populate('user', 'subscriptionExpiresAt status');
        const totalRevenue = payments.reduce((acc, curr) => {
            const isCaptured = curr.status === 'captured';
            const hasActiveSubscription = curr.user && curr.user.subscriptionExpiresAt && new Date(curr.user.subscriptionExpiresAt) > new Date();
            
            if (isCaptured && hasActiveSubscription) {
                return acc + curr.amount;
            }
            return acc;
        }, 0);
        
        // Calculate average rating based on experience
        const feedbacks = await Feedback.find();
        const ratingMap = { 'Excellent': 5, 'Good': 4, 'Average': 3, 'Poor': 2, 'Bad': 1 };
        const totalRating = feedbacks.reduce((acc, curr) => acc + (ratingMap[curr.experience] || 0), 0);
        const avgRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

        res.json({
            userCount,
            feedbackCount,
            totalRevenue,
            avgRating
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Payments
router.get('/payments', verifyToken, isAdmin, async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Feedbacks
router.get('/feedbacks', verifyToken, isAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'name email').sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
