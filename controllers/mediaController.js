const { uploadMedia ,getMediaByUserId } = require('../services/media/mediaService');
const { getUserByUsername } = require('../services/userService');
const { createMediaConvertJob } = require('../services/media/mediaConvertService');
/*This API is used for uploading the videos 
If no file is uploaded while calling post API for upload it will throw the error
Video Id */
const handleUpload = async (req, res) => {
    const { category } = req.body;
    const file = req.file;
    const userId = req.userId;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Step 1: Upload media to S3 and store metadata in the database
        const media = await uploadMedia(userId, category, file);
        console.log('Media uploaded successfully:', media);

        // Step 2: Create MediaConvert Job
        const inputFilePath = media.mediaUrl;
        const roleArn = 'arn:aws:iam::637423643789:role/service-role/MediaConvert_MGZN_Role';
        const jobTemplate = 'System-Generic_Mp4_Progressive'; 

        const mediaConvertJob = await createMediaConvertJob(inputFilePath, roleArn, jobTemplate);

        res.status(201).json({ 
            message: 'Media uploaded and MediaConvert job created successfully', 
            media
        });
    } catch (error) {
        console.error('Error uploading media or creating MediaConvert job:', error);
        res.status(500).json({ error: error.message });
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

module.exports = { handleUpload,fetchUserDetailsAndVideos};