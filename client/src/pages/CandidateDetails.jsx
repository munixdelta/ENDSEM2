import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await api.get(`/candidates/${id}`);
        setCandidate(response.data);
      } catch (err) {
        setError('Failed to fetch candidate details');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!candidate) return <div>Candidate not found</div>;

  return (
    <div className="candidate-details">
      <Link to="/candidates" className="btn" style={{ marginBottom: '20px', display: 'inline-block', border: '1px solid var(--border-color)' }}>
        &larr; Back to Candidates
      </Link>
      
      <div className="card">
        <h2 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>{candidate.name}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {candidate.email} | {candidate.experience} Years Experience
        </p>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Skills</h3>
          <div className="skills-container">
            {candidate.skills.map((skill, index) => (
              <span key={index} className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '14px' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Bio & Projects</h3>
          <div style={{ 
            backgroundColor: 'var(--body-bg)', 
            padding: '16px', 
            borderRadius: '8px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {candidate.bio}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
