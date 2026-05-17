const MatchBar = ({ score }) => {
  let color = 'var(--danger-color)';
  if (score >= 75) color = 'var(--success-color)';
  else if (score >= 50) color = 'orange';

  return (
    <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
      <div 
        style={{ 
          height: '100%', 
          width: `${score}%`, 
          backgroundColor: color,
          transition: 'width 0.5s ease-in-out'
        }} 
      />
    </div>
  );
};

export default MatchBar;
