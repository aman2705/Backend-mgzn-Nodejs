const express = require('express');
const multer = require('multer');
const mediaController = require('./controllers/mediaController');
const { signupUser } = require('./controllers/authController');
const { authenticateToken } = require('./middlewares/authmiddleWare');

const app = express();
const storage = multer.memoryStorage(); 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 } 
});


app.use(express.json());

app.post('/upload',authenticateToken,upload.single('file'), mediaController.handleUpload);
app.get('/fetch',authenticateToken, mediaController.fetchUserVideos);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
