const Candidate = require('../models/Candidate');

exports.basicMatch = async (req, res) => {
    try {
        const { requiredSkills, preferredSkills, minExperience } = req.body;

        if (!requiredSkills || requiredSkills.length === 0) {
            return res.status(400).json({ message: 'Required skills are mandatory' });
        }

        const reqSkillsLower = requiredSkills.map(s => s.toLowerCase().trim());
        const prefSkillsLower = preferredSkills ? preferredSkills.map(s => s.toLowerCase().trim()) : [];
        const expReq = Number(minExperience) || 0;

        const candidates = await Candidate.find();
        
        let matchedCandidates = candidates.map(candidate => {
            let score = 0;
            const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase().trim());
            
            // 1. Check required skills overlap
            let requiredOverlap = 0;
            reqSkillsLower.forEach(reqSkill => {
                if (candidateSkillsLower.includes(reqSkill)) {
                    requiredOverlap++;
                }
            });

            // Base score from required skills (max 60 points)
            if (reqSkillsLower.length > 0) {
                score += (requiredOverlap / reqSkillsLower.length) * 60;
            }

            // 2. Check preferred skills overlap
            let prefOverlap = 0;
            if (prefSkillsLower.length > 0) {
                prefSkillsLower.forEach(prefSkill => {
                    if (candidateSkillsLower.includes(prefSkill)) {
                        prefOverlap++;
                    }
                });
                // Bonus score from preferred skills (max 20 points)
                score += (prefOverlap / prefSkillsLower.length) * 20;
            }

            // 3. Check experience validation
            if (candidate.experience >= expReq) {
                score += 20; // 20 points if they meet minimum experience
            } else {
                // partial points for experience
                const ratio = candidate.experience / expReq;
                score += ratio * 15; 
            }

            score = Math.min(Math.round(score), 100);

            // Determine ranking category
            let ranking = 'Low Match';
            if (score >= 75) ranking = 'High Match';
            else if (score >= 50) ranking = 'Medium Match';

            return {
                ...candidate.toObject(),
                matchScore: score,
                ranking,
                matchDetails: {
                    requiredOverlap,
                    prefOverlap,
                    meetsExperience: candidate.experience >= expReq
                }
            };
        });

        // Filter out very low matches if necessary, but let's return all sorted by score
        matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json(matchedCandidates);

    } catch (error) {
        console.error('Basic match error:', error);
        res.status(500).json({ message: 'Server Error during matching' });
    }
};
