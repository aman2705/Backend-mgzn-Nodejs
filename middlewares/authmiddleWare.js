// middleware/authMiddleware.js
const { auth } = require('../config/firebaseConfig');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; // Attach user info to request
        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };
