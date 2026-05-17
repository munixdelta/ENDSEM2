const Candidate = require('../models/Candidate');

// Get all candidates
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single candidate
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.status(200).json(candidate);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a candidate
exports.addCandidate = async (req, res) => {
    try {
        const { name, email, skills, experience, bio } = req.body;
        
        // Basic validation
        if (!name || !email || !skills || experience == null) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate with this email already exists' });
        }

        // Process skills array if it's sent as a comma-separated string
        let processedSkills = skills;
        if (typeof skills === 'string') {
            processedSkills = skills.split(',').map(s => s.trim()).filter(s => s);
        }

        const candidate = new Candidate({
            name,
            email,
            skills: processedSkills,
            experience: Number(experience),
            bio
        });

        await candidate.save();
        res.status(201).json(candidate);
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
