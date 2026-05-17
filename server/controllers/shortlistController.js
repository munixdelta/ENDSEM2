const Shortlist = require('../models/Shortlist');

exports.saveShortlist = async (req, res) => {
    try {
        const { jobTitle, candidates, aiAnalysis } = req.body;
        
        if (!jobTitle || !aiAnalysis) {
            return res.status(400).json({ message: 'Job title and AI Analysis are required' });
        }

        const shortlist = new Shortlist({
            jobTitle,
            candidates,
            aiAnalysis
        });

        await shortlist.save();
        res.status(201).json(shortlist);
    } catch (error) {
        console.error('Save shortlist error:', error);
        res.status(500).json({ message: 'Server Error saving shortlist' });
    }
};

exports.getShortlists = async (req, res) => {
    try {
        const shortlists = await Shortlist.find().sort({ createdAt: -1 });
        res.status(200).json(shortlists);
    } catch (error) {
        console.error('Get shortlists error:', error);
        res.status(500).json({ message: 'Server Error fetching shortlists' });
    }
};
