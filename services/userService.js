const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = "USERS_TABLE";

const getUserByUsername = async (username) => {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            username
        }
    };

    const result = await dynamoDb.get(params).promise();
    return result.Item;
};

const addUserToDB = async (userData) => {
    const params = {
        TableName: USERS_TABLE,
        Item: userData
    };

    await dynamoDb.put(params).promise();
    return userData;
};

module.exports = { getUserByUsername, addUserToDB };
