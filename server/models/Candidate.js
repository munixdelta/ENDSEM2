const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    skills: {
        type: [String],
        required: true
    },
    experience: {
        type: Number, // Years of experience
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        default: null // Will be calculated when matching against a job requirement
    },
    matchExplanation: {
        type: String,
        default: null // AI explanation for the match
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
