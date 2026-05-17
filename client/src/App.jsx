import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateList from './pages/CandidateList';
import CandidateDetails from './pages/CandidateDetails';
import JobRequirement from './pages/JobRequirement';
import Shortlisted from './pages/Shortlisted';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/candidates/:id" element={<CandidateDetails />} />
              <Route path="/job-requirements" element={<JobRequirement />} />
              <Route path="/shortlisted" element={<Shortlisted />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
