const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Follow a user
const followUser = async (followerId, followingId) => {
    const params = {
        TableName: 'FollowRelationships',
        Item: {
            followerId,
            followingId,
            followedAt: new Date().toISOString()
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return { message: 'User followed successfully' };
    } catch (error) {
        throw new Error('Error following user: ' + error.message);
    }
};

// Unfollow a user
const unfollowUser = async (followerId, followingId) => {
    const params = {
        TableName: 'FollowRelationships',
        Key: {
            followerId,
            followingId
        }
    };

    try {
        await dynamoDb.delete(params).promise();
        return { message: 'User unfollowed successfully' };
    } catch (error) {
        throw new Error('Error unfollowing user: ' + error.message);
    }
};

// Get followers for a user
const getFollowers = async (userId) => {
    const params = {
        TableName: 'FollowRelationships',
        IndexName: 'followingId-index', // Create a GSI for quick lookup by followingId
        KeyConditionExpression: 'followingId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
    };

    try {
        const result = await dynamoDb.query(params).promise();
        return result.Items;
    } catch (error) {
        throw new Error('Error fetching followers: ' + error.message);
    }
};

// Get followings for a user
const getFollowings = async (userId) => {
    const params = {
        TableName: 'FollowRelationships',
        KeyConditionExpression: 'followerId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
    };

    try {
        const result = await dynamoDb.query(params).promise();
        return result.Items;
    } catch (error) {
        throw new Error('Error fetching followings: ' + error.message);
    }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowings };
