const { dynamoDB } = require('../config/awsConfig');

const TABLE_NAME = 'MediaTable';

const saveMedia = async (media) => {
    const params = {
        TableName: TABLE_NAME,
        Item: media,
    };
    try {
        await dynamoDB.put(params).promise();
        console.log('Media saved successfully:', media);
    } catch (error) {
        console.error('Error saving media to DynamoDB:', error);
        throw new Error('Could not save media');
    }
};

const getMediaByUserId = async (userId) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    try {
        const result = await dynamoDB.query(params).promise();
        return result.Items;
    } catch (error) {
        console.error('Error fetching media by userId:', error);
        throw new Error('Could not fetch media.');
    }
};

const getTotalSizeByUserId = async (userId) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    const result = await dynamoDB.query(params).promise();
    const totalSize = result.Items.reduce((sum, item) => sum + (item.fileSize || 0), 0);
    return totalSize;
};

module.exports = { saveMedia, getMediaByUserId ,getTotalSizeByUserId};
