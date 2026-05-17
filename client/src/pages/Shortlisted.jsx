import { useState, useEffect } from 'react';
import api from '../api';
import MatchBar from '../components/MatchBar';
import '../styles/shortlist.css';

const Shortlisted = () => {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'saved'
  
  // Tab 1: Generate Shortlist States
  const [formData, setFormData] = useState({
    jobTitle: '',
    requiredSkills: '',
    preferredSkills: '',
    minExperience: ''
  });
  const [matchingCandidates, setMatchingCandidates] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tab 2: Saved Shortlists States
  const [savedShortlists, setSavedShortlists] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [selectedShortlist, setSelectedShortlist] = useState(null);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedShortlists();
    }
  }, [activeTab]);

  const fetchSavedShortlists = async () => {
    setLoadingSaved(true);
    try {
      const response = await api.get('/shortlist');
      setSavedShortlists(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFindMatches = async (e) => {
    e.preventDefault();
    setLoadingMatch(true);
    setError('');
    setAiAnalysis('');
    setSuccess('');

    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: formData.preferredSkills ? formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s) : [],
        minExperience: Number(formData.minExperience)
      };

      const response = await api.post('/match', payload);
      setMatchingCandidates(response.data);
      if (response.data.length === 0) {
        setError('No candidates match the minimum requirements.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to match candidates');
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleRunAI = async () => {
    if (matchingCandidates.length === 0) return;
    setLoadingAI(true);
    setError('');

    try {
      const payload = {
        candidates: matchingCandidates,
        jobRequirements: {
          requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
          preferredSkills: formData.preferredSkills ? formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s) : [],
          minExperience: Number(formData.minExperience)
        }
      };

      const response = await api.post('/ai/shortlist', payload);
      setAiAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run AI analysis');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveShortlist = async () => {
    if (!formData.jobTitle || !aiAnalysis) return;
    
    try {
      const payload = {
        jobTitle: formData.jobTitle,
        candidates: matchingCandidates.slice(0, 3).map(c => ({
          candidateId: c._id,
          name: c.name,
          matchScore: c.matchScore,
          ranking: c.ranking
        })),
        aiAnalysis: aiAnalysis
      };

      await api.post('/shortlist/save', payload);
      setSuccess('Shortlist and AI recommendation saved successfully!');
    } catch (err) {
      setError('Failed to save shortlist');
    }
  };

  return (
    <div className="shortlist-page">
      <div className="tab-buttons">
        <button 
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          ✨ AI Shortlist Generator
        </button>
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          📂 Saved Recommendations
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="tab-content">
          <div className="grid-2col">
            {/* Input Form */}
            <div className="card">
              <h2>AI Criteria Setup</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Enter the job parameters to generate smart AI recommendations.
              </p>

              <form onSubmit={handleFindMatches}>
                <div className="form-group">
                  <label>Job Title (e.g. Senior Frontend Dev) *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="form-control"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. React Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Required Skills (Comma separated) *</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    className="form-control"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. React, Node.js"
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="preferredSkills"
                    className="form-control"
                    value={formData.preferredSkills}
                    onChange={handleInputChange}
                    placeholder="e.g. AWS, Docker"
                  />
                </div>

                <div className="form-group">
                  <label>Min Experience (Years) *</label>
                  <input
                    type="number"
                    name="minExperience"
                    className="form-control"
                    value={formData.minExperience}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 2"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loadingMatch}>
                  {loadingMatch ? 'Searching...' : 'Find Matches'}
                </button>
              </form>
            </div>

            {/* Match Table */}
            <div className="card">
              <h2>Matched Candidates</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Basic system matching before AI analysis.
              </p>

              {matchingCandidates.length === 0 ? (
                <div className="empty-state">
                  <p>Submit the criteria form to calculate candidates.</p>
                </div>
              ) : (
                <div>
                  <div className="matching-list">
                    {matchingCandidates.slice(0, 4).map(candidate => (
                      <div key={candidate._id} className="candidate-match-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong>{candidate.name}</strong>
                          <span className={`badge ${candidate.ranking === 'High Match' ? 'badge-success' : 'badge-primary'}`}>
                            {candidate.matchScore}%
                          </span>
                        </div>
                        <MatchBar score={candidate.matchScore} />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                          Experience: {candidate.experience} years | Skills: {candidate.skills.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleRunAI} 
                    className="btn btn-primary" 
                    disabled={loadingAI}
                    style={{ width: '100%', marginTop: '20px', backgroundColor: '#7209b7' }}
                  >
                    {loadingAI ? 'AI Analysing (Please wait)...' : '✨ Generate AI Shortlisting & Interview Questions'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Response Card */}
          {aiAnalysis && (
            <div className="card ai-response-card" style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <h2>🤖 HireAI Recommendation & Interview Questions</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleSaveShortlist} className="btn btn-primary" style={{ backgroundColor: 'var(--success-color)' }}>
                    💾 Save This Analysis
                  </button>
                </div>
              </div>

              {success && <div className="success-message" style={{ marginBottom: '20px' }}>{success}</div>}
              {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}

              <div className="ai-report-body" style={{ whiteSpace: 'pre-line', lineHeight: '1.7', backgroundColor: 'var(--body-bg)', padding: '24px', borderRadius: '8px' }}>
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="tab-content grid-2col">
          <div className="card">
            <h2>Saved Shortlisting Reports</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Select a report to view previous AI insights.
            </p>

            {loadingSaved ? (
              <p>Loading...</p>
            ) : savedShortlists.length === 0 ? (
              <p>No saved shortlists found.</p>
            ) : (
              <div className="saved-list">
                {savedShortlists.map(item => (
                  <div 
                    key={item._id} 
                    className={`saved-item ${selectedShortlist?._id === item._id ? 'active' : ''}`}
                    onClick={() => setSelectedShortlist(item)}
                  >
                    <h4>{item.jobTitle}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Saved on: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            {selectedShortlist ? (
              <div>
                <h2>{selectedShortlist.jobTitle}</h2>
                <p style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                  AI Analysis Details
                </p>
                <div className="ai-report-body" style={{ whiteSpace: 'pre-line', lineHeight: '1.7', backgroundColor: 'var(--body-bg)', padding: '20px', borderRadius: '8px' }}>
                  {selectedShortlist.aiAnalysis}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Select a report from the list to display details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shortlisted;
