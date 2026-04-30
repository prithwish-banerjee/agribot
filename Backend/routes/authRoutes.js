const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({ message: "User registered" });

    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
const jwt = require('jsonwebtoken');

const SECRET = "mysecretkey";

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ id: user.id }, SECRET);

        res.json({ message: "Login successful", token });

    } catch (err) {
        res.status(500).json(err);
    }
});

const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Protected data accessed",
        user: req.user
    });
});

module.exports = router;