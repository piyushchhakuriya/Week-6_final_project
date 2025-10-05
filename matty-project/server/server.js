const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const connectDB = require('./config/db');

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mattywebdesign.netlify.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // increased for large base64 payloads

//health
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

// Cloudinary upload route for thumbnail
app.post('/api/upload-thumbnail', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
      folder: 'canvas-thumbnails',
    });
    res.json({ url: uploadResponse.secure_url });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ message: 'Cloudinary upload failed' });
  }
});

// MongoDB connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
