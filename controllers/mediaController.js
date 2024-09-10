const { uploadMedia ,getMediaByUserId } = require('../services/mediaService');
const { getUserByUsername } = require('../services/userService');
/*This API is used for uploading the videos 
If no file is uploaded while calling post API for upload it will throw the error
Video Id */
const handleUpload = async (req, res) => {
    const {category} = req.body;
    const file = req.file;
    const userId = req.userId;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    try {
        const media = await uploadMedia(userId, category, file);
        res.status(201).json({ message: 'Media uploaded successfully', media });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: error.message });
    }
};


const fetchUserVideos = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const media = await getMediaByUserId(userId);
        if (!media || media.length === 0) {
            return res.status(404).json({ message: 'No media found for this user.' });
        }
        res.status(200).json({ media });
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Error fetching media.' });
    }
};

const fetchUserDetailsAndVideos = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const media = await getMediaByUserId(user.userId);

        res.status(200).json({
            user: {
                userId: user.userId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                expertise: user.expertise,
            },
            media: media
        });
    } catch (error) {
        console.error('Error fetching user details and videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handleUpload,fetchUserVideos,fetchUserDetailsAndVideos};