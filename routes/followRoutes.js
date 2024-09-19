const express = require('express');
const { followController, unfollowController, getFollowersController, getFollowingController } = require('../controllers/followController');
const router = express.Router();

router.post('/follow', followController);
router.post('/unfollow', unfollowController);
router.get('/:userId/followers', getFollowersController);
router.get('/:userId/following', getFollowingController);

module.exports = router;