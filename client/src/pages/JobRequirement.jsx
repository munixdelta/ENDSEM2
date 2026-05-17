import { useState } from 'react';
import api from '../api';
import MatchBar from '../components/MatchBar';
import { Link } from 'react-router-dom';

const JobRequirement = () => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: formData.preferredSkills ? formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s) : [],
        minExperience: Number(formData.minExperience)
      };

      const response = await api.post('/match', payload);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-requirement">
      <div className="card candidate-form" style={{ maxWidth: '800px' }}>
        <h2>Job Requirements Input</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Enter the requirements for the open position to match candidates from the database.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Required Skills (Comma separated) *</label>
            <input
              type="text"
              name="requiredSkills"
              className="form-control"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
              placeholder="e.g. React, Node.js, Express"
            />
          </div>

          <div className="form-group">
            <label>Preferred Skills (Comma separated)</label>
            <input
              type="text"
              name="preferredSkills"
              className="form-control"
              value={formData.preferredSkills}
              onChange={handleChange}
              placeholder="e.g. Docker, AWS, TypeScript"
            />
          </div>

          <div className="form-group">
            <label>Minimum Experience (Years) *</label>
            <input
              type="number"
              name="minExperience"
              className="form-control"
              value={formData.minExperience}
              onChange={handleChange}
              required
              min="0"
              step="0.5"
              placeholder="e.g. 2"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Analyzing Matches...' : 'Find Matches'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Matching Results ({results.length} found)</h2>
            <Link to="/shortlisted" className="btn btn-primary" style={{ backgroundColor: '#7209b7' }}>
              ✨ Run AI Shortlisting
            </Link>
          </div>

          {results.length === 0 ? (
            <p>No candidates match your criteria.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Experience</th>
                    <th>Match Score</th>
                    <th>Rank</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(candidate => (
                    <tr key={candidate._id}>
                      <td>
                        <strong>{candidate.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{candidate.email}</div>
                      </td>
                      <td>{candidate.experience} Yrs</td>
                      <td style={{ width: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold' }}>{candidate.matchScore}%</span>
                          <MatchBar score={candidate.matchScore} />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${candidate.ranking === 'High Match' ? 'badge-success' : 'badge-primary'}`}>
                          {candidate.ranking}
                        </span>
                      </td>
                      <td>
                        <Link to={`/candidates/${candidate._id}`} className="btn btn-outline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobRequirement;
