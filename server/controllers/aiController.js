const axios = require('axios');

exports.analyzeCandidates = async (req, res) => {
    try {
        const { candidates, jobRequirements } = req.body;

        if (!candidates || candidates.length === 0) {
            return res.status(400).json({ message: 'No candidates provided for analysis' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ message: 'OpenRouter API key is not configured' });
        }

        // We only want to analyze top candidates to save tokens, say top 3
        const topCandidates = candidates.slice(0, 3).map(c => ({
            name: c.name,
            skills: c.skills.join(', '),
            experience: c.experience,
            bio: c.bio,
            matchScore: c.matchScore
        }));

        const prompt = `
        You are an expert technical IT Recruiter. 
        Job Requirements: 
        - Required Skills: ${jobRequirements.requiredSkills.join(', ')}
        - Preferred Skills: ${jobRequirements.preferredSkills.join(', ')}
        - Minimum Experience: ${jobRequirements.minExperience} years

        Please evaluate the following top ${topCandidates.length} candidates and provide:
        1. A brief summary of why they are or aren't a good fit.
        2. 2 specific interview questions for each candidate based on their bio/skills to test their actual competency.

        Candidates Data:
        ${JSON.stringify(topCandidates, null, 2)}

        Format the output nicely.
        `;

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-2.5-flash', // Using a fast, standard model
                messages: [
                    { role: 'system', content: 'You are a helpful AI recruiting assistant.' },
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:5173', // required by openrouter
                    'X-Title': 'Candidate Shortlisting System',
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiAnalysis = response.data.choices[0].message.content;

        res.status(200).json({ 
            analysis: aiAnalysis,
            analyzedCandidatesCount: topCandidates.length
        });

    } catch (error) {
        console.error('AI Analysis Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to generate AI analysis' });
    }
};
