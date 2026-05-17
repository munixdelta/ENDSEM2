const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    candidates: [{
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate'
        },
        name: String,
        matchScore: Number,
        ranking: String
    }],
    aiAnalysis: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
