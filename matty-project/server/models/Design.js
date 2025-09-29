const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    jsonData: { type: Object, required: true }, // Konva/Fabric canvas data
    thumbnailUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', designSchema);
