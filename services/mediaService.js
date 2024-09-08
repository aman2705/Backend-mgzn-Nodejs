const { saveMedia, getTotalSizeByUserId, getMediaByUserId  } = require('../models/mediaModel');
const { uploadToS3 } = require('./s3Service');
const { v4: uuidv4 } = require('uuid');
const MAX_SIZE_LIMIT = 1 * 500 * 1024 * 1024; // 500 MB limit

const uploadMedia = async (userId, category, file) => {
    const mediaId = uuidv4(); 
    const uploadDate = new Date().toISOString();
    const fileSize = file.size;

    const totalSize = await getTotalSizeByUserId(userId);
    if (totalSize + fileSize > MAX_SIZE_LIMIT) {
        throw new Error('Upload limit exceeded. You can only upload up to 1GB of media.');
    }

    const mediaUrl = await uploadToS3(file, 'mgznstorage');
    const media = {
        userId,
        mediaId,
        mediaUrl,
        category,
        fileSize,
        uploadDate,
    };

    await saveMedia(media);
    return media;
};



module.exports = { uploadMedia,getMediaByUserId};
