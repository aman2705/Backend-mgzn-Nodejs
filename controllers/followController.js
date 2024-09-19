const { followUser, unfollowUser, getFollowers, getFollowings } = require('../services/follow-unfollow/followUnfollowService');
const { sendFollowNotification } = require('../utils/notification');
// Controller to follow a user
const followController = async (req, res) => {
    const { followerId, followeeId } = req.body;
    if (!followerId || !followeeId) {
        return res.status(400).json({ error: 'Follower and followee IDs are required' });
    }

    try {
        await followUser(followerId, followeeId);
        await sendFollowNotification(followerId, followeeId);
        res.status(200).json({ message: 'Successfully followed the user' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to unfollow a user
const unfollowController = async (req, res) => {
    const { followerId, followeeId } = req.body;
    if (!followerId || !followeeId) {
        return res.status(400).json({ error: 'Follower and followee IDs are required' });
    }

    try {
        await unfollowUser(followerId, followeeId);
        res.status(200).json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to get followers list
const getFollowersController = async (req, res) => {
    const { userId } = req.params;

    try {
        const followers = await getFollowers(userId);
        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to get following list
const getFollowingController = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await getFollowings(userId);
        res.status(200).json({ following });
    } catch (error) {
        console.error('Error fetching following list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    followController,
    unfollowController,
    getFollowersController,
    getFollowingController
};
