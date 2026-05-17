import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/candidates.css';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/candidates', formData);
      setSuccess('Candidate added successfully!');
      setTimeout(() => {
        navigate('/candidates');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate">
      <div className="card candidate-form">
        <h2>Add Candidate Form</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Enter the details of the candidate to add them to the system.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g. john@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="skills">Skills (comma separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
            <div className="form-group">
              <label htmlFor="experience">Experience (Years)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                className="form-control"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio / Projects</label>
            <textarea
              id="bio"
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              required
              placeholder="Brief description about the candidate and their projects..."
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => navigate('/candidates')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
