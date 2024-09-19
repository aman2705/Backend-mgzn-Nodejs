const express = require('express');
const { addUserToDB, getUserByUsername } = require('../services/userService');
const router = express.Router();

// Regex for validating Instagram and Twitter (X) URLs
const instagramUrlRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/;
const twitterUrlRegex = /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/?$/;

router.post('/details', async (req, res) => {
    const { username, firstName, lastName, phoneNumber, expertise, instagramId, twitterId } = req.body;
    const userId = req.userId;
    let errors = [];

    // Check if all required fields are present
    if (!username || !firstName || !lastName || !phoneNumber || !expertise) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate Instagram URL
    if (instagramId && !instagramUrlRegex.test(instagramId)) {
        errors.push('Invalid Instagram URL format');
    }

    // Validate Twitter/X URL
    if (twitterId && !twitterUrlRegex.test(twitterId)) {
        errors.push('Invalid Twitter/X URL format');
    }

    // Return all validation errors if any exist
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Check if username already exists
        const usernameExists = await getUserByUsername(username);
        if (usernameExists) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        // Save user details to the database
        const user = await addUserToDB({
            userId,
            username,
            firstName,
            lastName,
            phoneNumber,
            expertise,
            instagramId,
            twitterId
        });

        res.status(201).json({ message: 'User details saved successfully', user });
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
