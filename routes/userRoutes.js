const express = require('express');
const { addUserToDB, getUserByUsername } = require('../services/userService');
const router = express.Router();

router.post('/details', async (req, res) => {
    const { username, firstName, lastName, phoneNumber, expertise } = req.body;
    const userId = req.userId;

    if (!username || !firstName || !lastName || !phoneNumber || !expertise) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const usernameExists = await getUserByUsername(username);
        if (usernameExists) {
            return res.status(409).json({ error: 'Username is already taken' });
        }
        const user = await addUserToDB({ userId, username, firstName, lastName, phoneNumber, expertise });
        res.status(201).json({ message: 'User details saved successfully', user });
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
