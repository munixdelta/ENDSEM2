import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/candidates.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidates(response.data);
    } catch (err) {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`);
        setCandidates(candidates.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete candidate');
      }
    }
  };

  if (loading) return <div>Loading candidates...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="candidate-list">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Candidates</h2>
          <Link to="/add-candidate" className="btn btn-primary">
            + Add Candidate
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="empty-state">
            <p>No candidates found. Add some candidates to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.experience} Yrs</td>
                    <td>
                      <div className="skills-container">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="badge badge-primary">{skill}</span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="badge badge-success">+{candidate.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/candidates/${candidate._id}`} className="btn" style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: 'var(--light-color)', border: '1px solid var(--border-color)' }}>
                          View
                        </Link>
                        <button 
                          onClick={() => handleDelete(candidate._id)}
                          className="btn btn-danger" 
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
