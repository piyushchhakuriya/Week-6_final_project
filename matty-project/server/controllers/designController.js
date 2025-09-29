const Design = require('../models/Design');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose'); // Import mongoose for ID validation

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create new design
exports.createDesign = async (req, res) => {
    // --- VALIDATION START ---
    const { title, jsonData, thumbnail } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
    }
    if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
        return res.status(400).json({ message: 'jsonData is required and must be an object.' });
    }
    // --- VALIDATION END ---

    try {
        let thumbnailUrl = '';
        if (thumbnail) {
            const result = await cloudinary.uploader.upload(thumbnail, { folder: 'matty_designs' });
            thumbnailUrl = result.secure_url;
        }

        const newDesign = new Design({
            userId: req.user.id,
            title,
            jsonData,
            thumbnailUrl
        });

        await newDesign.save();
        res.status(201).json(newDesign);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all user designs
exports.getDesigns = async (req, res) => {
    try {
        const designs = await Design.find({ userId: req.user.id });
        res.status(200).json(designs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update design
exports.updateDesign = async (req, res) => {
    // --- VALIDATION START ---
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'The provided ID is not a valid format.' });
    }
    const { title, jsonData, thumbnail } = req.body;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Update failed. Request body cannot be empty.' });
    }
    // --- VALIDATION END ---

    try {
        const design = await Design.findById(id);
        if (!design) return res.status(404).json({ message: 'Design not found' });
        if (design.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        design.title = title || design.title;
        design.jsonData = jsonData || design.jsonData;

        if (thumbnail) {
            const result = await cloudinary.uploader.upload(thumbnail, { folder: 'matty_designs' });
            design.thumbnailUrl = result.secure_url;
        }

        await design.save();
        res.status(200).json(design);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete design
exports.deleteDesign = async (req, res) => {
    // --- VALIDATION START ---
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'The provided ID is not a valid format.' });
    }
    // --- VALIDATION END ---

    try {
        const design = await Design.findById(id);
        if (!design) return res.status(404).json({ message: 'Design not found' });
        if (design.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        const deletedDesign = await Design.findByIdAndDelete(id);

        res.status(200).json({ message: 'Design deleted', deletedDesign: deletedDesign });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};