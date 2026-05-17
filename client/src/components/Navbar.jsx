import '../styles/navbar.css';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/candidates': return 'Candidate List';
      case '/add-candidate': return 'Add New Candidate';
      case '/job-requirements': return 'Job Requirements';
      case '/shortlisted': return 'AI Shortlisted Candidates';
      default:
        if (location.pathname.startsWith('/candidates/')) {
          return 'Candidate Details';
        }
        return 'System';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-title">
        <h1>{getPageTitle()}</h1>
      </div>
      <div className="navbar-user">
        <div className="user-avatar">AD</div>
        <span className="user-name">Admin User</span>
      </div>
    </header>
  );
};

export default Navbar;
