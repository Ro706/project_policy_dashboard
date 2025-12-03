const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Register Admin (Protected, only admins can create admins)
router.post('/create-admin', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Admin already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check Admin collection
        const admin = await Admin.findOne({ email });
        
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign(
            { id: admin._id, type: 'admin' }, 
            process.env.JWT_SECRET || 'secretKey',
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;