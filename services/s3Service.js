const { s3 } = require('../config/awsConfig');

/**Logic for storing Media into S3 Bucket**/
const uploadToS3 = async (file, bucketName) => {
    const params = {
        Bucket: bucketName,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    const result = await s3.upload(params).promise();
    return result.Location;
};

module.exports = { uploadToS3 };