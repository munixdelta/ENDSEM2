import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/candidates', label: 'All Candidates', icon: '👥' },
    { path: '/add-candidate', label: 'Add Candidate', icon: '➕' },
    { path: '/job-requirements', label: 'Job Requirements', icon: '📋' },
    { path: '/shortlisted', label: 'AI Shortlisting', icon: '✨' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>HireAI</h2>
        <p>Shortlisting System</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
