const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    cloudCover: { type: Number, required: true },
    sunElevation: { type: Number, required: true },
    earthsunDistance: { type: Number, required: true }
});

measurementSchema.index({ timestamp: 1 });

module.exports = mongoose.model('Measurement', measurementSchema);