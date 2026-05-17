const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('./models/Candidate');

const dummyData = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
    experience: 3,
    bio: 'Full stack developer with 3 years of experience building MERN apps. Created an e-commerce platform and a chat application.'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    experience: 5,
    bio: 'Backend specialist focusing on scalable microservices. Maintained legacy Java systems and migrated them to Spring Boot.'
  },
  {
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    skills: ['Python', 'Django', 'React', 'PostgreSQL'],
    experience: 1.5,
    bio: 'Recent graduate who built multiple full-stack projects during university. Strong problem-solving skills.'
  },
  {
    name: 'Diana Evans',
    email: 'diana@example.com',
    skills: ['React', 'CSS', 'Figma', 'JavaScript'],
    experience: 2,
    bio: 'Frontend developer with a keen eye for design. Translated Figma mockups into pixel-perfect React components.'
  },
  {
    name: 'Evan Wright',
    email: 'evan@example.com',
    skills: ['Node.js', 'AWS', 'Docker', 'MongoDB', 'Redis'],
    experience: 4,
    bio: 'Cloud architecture enthusiast. Deployed highly available Node.js applications using AWS ECS and Docker.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    await Candidate.deleteMany({});
    console.log('Cleared existing candidates');

    await Candidate.insertMany(dummyData);
    console.log('Dummy candidates inserted successfully!');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
