import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/candidates');
        setStats({
          total: res.data.length,
          recent: res.data.slice(0, 3) // get top 3 latest
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Candidates</h3>
            <p className="stat-value">{loading ? '...' : stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Shortlisted</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Active Jobs</h3>
            <p className="stat-value">1</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card recent-candidates">
          <div className="card-header">
            <h2>Recently Added Candidates</h2>
            <Link to="/candidates" className="view-all">View All</Link>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : stats.recent.length === 0 ? (
            <p className="text-muted">No candidates added yet.</p>
          ) : (
            <ul className="recent-list">
              {stats.recent.map(candidate => (
                <li key={candidate._id} className="recent-item">
                  <div className="recent-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.experience} Yrs Experience</p>
                  </div>
                  <Link to={`/candidates/${candidate._id}`} className="btn btn-outline">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/add-candidate" className="action-btn">
              <span className="icon">➕</span>
              Add Candidate
            </Link>
            <Link to="/job-requirements" className="action-btn">
              <span className="icon">🎯</span>
              Match Candidates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
