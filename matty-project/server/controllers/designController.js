const Design = require('../models/Design');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create new design
exports.createDesign = async (req, res) => {
    const { title, jsonData, thumbnail } = req.body; // thumbnail = base64 or image URL
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
    const { id } = req.params;
    const { title, jsonData, thumbnail } = req.body;
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
    const { id } = req.params;
    try {
        const design = await Design.findById(id);
        if (!design) return res.status(404).json({ message: 'Design not found' });
        if (design.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await design.remove();
        res.status(200).json({ message: 'Design deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
