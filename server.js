const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path'); // Add this!

const app = express();
app.use(cors());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'voice-notes',
        resource_type: 'video',
    },
});

const upload = multer({ storage: storage });

// VERCEL FIX: Manually serve the index.html for the home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Also keep this to serve CSS/JS if you add any later
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('voiceNote'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({
        message: "Sent to Cloud!",
        url: req.file.path
    });
});

// For Vercel, we don't strictly need app.listen, but it doesn't hurt.
// The export is what matters most.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;