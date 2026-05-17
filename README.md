# Candidate Profile Shortlisting System using AI API & Skill Matching

A complete, full-stack college ESE project. It allows recruiters to manage candidates, set job requirements, calculate matching scores based on skills/experience, and run an advanced **AI analysis** using OpenRouter API to obtain detailed suitability reviews and custom interview questions for each candidate.

---

## 🚀 Features

### 1. Candidate Management
- Add new candidate details (Name, Email, Skills, Experience, Bio/Projects).
- Store skills in a clean array structure in the database.
- Delete candidate profiles.
- View individual, detailed profiles.

### 2. Job Requirement & Skill Matching
- Input required skills, preferred skills, and minimum experience.
- Calculate **Skill Overlap Percentage** and **Experience Validation**.
- Dynamic match scoring (out of 100) and ranking:
  - **High Match** (>= 75%)
  - **Medium Match** (50% - 74%)
  - **Low Match** (< 50%)
- Real-time progress bars with custom colors based on suitability.

### 3. AI-Based Recommendation (OpenRouter API)
- Deep, context-aware analysis of candidate experience, skills, and bios.
- Explanation of candidate fit (beyond simple keyword-based matching).
- Generates **custom, targeted interview questions** for each candidate!
- Ability to **Save AI Shortlist Reports** to the database for historical reviews.

### 4. Interactive Dashboard
- Live metrics showing total candidate count, shortlist reports saved, and jobs.
- Displays recently added candidates for quick access.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Axios, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI Integration:** OpenRouter API (utilizing Gemini Flash)
- **Styling:** Custom, premium CSS layout with fully responsive Sidebar + Navbar

---

## 📁 Folder Structure
```text
ENDSEM3/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, MatchBar
│   │   ├── pages/              # Dashboard, AddCandidate, Shortlisted, etc.
│   │   ├── styles/             # Global.css, shortlist.css, etc.
│   │   ├── api.js              # Axios backend connection
│   │   └── App.jsx             # Main routing & layout setup
│   └── package.json
└── server/                     # Node.js Express Backend
    ├── controllers/            # Controller logic (match, ai, candidate)
    ├── models/                 # Mongoose schemas (Candidate, Shortlist)
    ├── routes/                 # Express router mapping
    ├── index.js                # Server entry point
    ├── .env                    # Local environment config
    ├── seedCandidates.js       # Prepopulated dummy profiles
    └── package.json
```

---

## ⚙️ Setup and Installation

### 1. Clone the project and open the workspace.

### 2. Configure Backend Environment
Create a file named `.env` in the `server` directory and add the following keys:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/candidate_shortlist_db
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run Database Seeder (Highly Recommended for Viva)
To immediately populate your local/Atlas database with 5 realistic candidate developer profiles, run the seeder script:
```bash
cd server
npm install
node seedCandidates.js
```

### 4. Start the Application

**To run the Backend:**
```bash
cd server
npm run dev   # or: npx nodemon index.js
```
*(You will see "Server running on port 5000" & "MongoDB connected successfully")*

**To run the Frontend:**
```bash
cd client
npm install
npm run dev
```
*(Open the Local Vite URL, e.g., `http://localhost:5173` in your browser)*

---

## ⚡ Deployment Information

### Backend (Render Deployment)
- Set build command: `npm install`
- Set start command: `node index.js`
- Ensure the env variables `MONGO_URI` and `OPENROUTER_API_KEY` are added in Render's dashboard under **Environment**.

### Frontend (Vercel Deployment)
- Make sure to create a `.env.production` or set the variable `VITE_API_URL` to point to your live Render backend URL (e.g., `https://your-backend.onrender.com/api`).
