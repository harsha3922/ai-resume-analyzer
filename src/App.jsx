import { useState } from "react";

function App() {
//1. state
    // Stores the resume file selected by the user
  const [resume, setResume] = useState(null);
    // Stores the job description selected by the user
  const [jobDescription, setJobDescription] = useState("");

  // Tells us whether the analysis is currently running
  // false = not analyzing
  // true  = analyzing
  const [loading, setLoading] = useState(false);
  // Stores the analysis result
  // Initially there is no result, so we use null
  const [result, setResult] = useState(null);

 
//2. resume upload handler
   // This function runs whenever the user selects a resume file.
  
   const handleResumeChange = (e) => {
      // event.target.files contains the files selected by the user.
     // [0] means we only want the first selected file.
      const selectedFile = event.target.files[0];
     // Store the selected file inside React state.
       setResume(selectedFile);
  };

//3. analyze button handler
  
  const handleAnalyze = () => {
    
    //validation first,check whether the user uploaded a resume and job description where  trim() removes unnecessary spaces.
    if (!resume || !jobDescription.trim()) {
      alert("Please upload your resume and enter a job description.");
      return;
    }

     // Start loading.
    // This will change the button text to "Analyzing..."
     setLoading(true);


   setTimeout(() => {

      // Dummy result that will be displayed in the UI. bcoz right now i have no backened ,later it replace by an api call to our node.js/express backend
      setResult({
        score: 78,

        matchingSkills: [
          "React.js",
          "JavaScript",
          "Node.js",
          "MongoDB",
        ],

        missingSkills: [
          "TypeScript",
          "Docker",
          "AWS",
        ],

        suggestions: [
          "Improve your project descriptions.",
          "Highlight skills that are relevant to the job description.",
          "Add missing skills only if you genuinely know them.",
        ]

      });

      // Reset the input fields after analysis is completed
// setResume(null);
// setJobDescription("");


      // Analysis is completed, so stop the loading state.
      setLoading(false);

    }, 1500); // Wait 1.5 seconds to simulate analysis time
  };

//4. UI / JSX

  return (
    <div className="app">

         {/* navbar */}
      <header className="navbar">
        <div className="logo">ResumeAI</div>

        <nav>
          <a href="#analyzer">Analyzer</a>
          <a href="#features">Features</a>
        </nav>
      </header>

   <main>
         {/* hero */}
      <section className="hero">
          <p className="badge">AI-Powered Resume Analysis</p>

          <h1>
            Make Your Resume
            <span> Job Ready</span>
          </h1>

          <p className="hero-text">
            Analyze your resume against a job description and discover
            matching skills, missing keywords, and improvement suggestions.
          </p>
        </section>

         {/* analyzer */}
      <section className="analyzer"    id="analyzer">
           {/* resume card */}
          <div className="card">
            <h2>Upload Your Resume</h2>
            <p>Upload your PDF or DOCX resume.</p>

            <label className="upload-box">
              <span className="upload-icon">📄</span>

              <strong>
                {resume ? resume.name : "Choose your resume"}
              </strong>

              <small>
                {resume
                  ? "Resume selected successfully"
                  : "PDF or DOCX files"}
              </small>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </label>
          </div>
            {/* job description card */}
          <div className="card">
            <h2>Job Description</h2>
            <p>Paste the job description you're applying for.</p>

            <textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>
          </div>

      </section>

        {/* NEW: Full-width Analysis Result section */}
{result && (
  <section className="analysis-result-section">

    {/* Main container for the complete analysis result */}
    <div className="analysis-result-container">

      {/* Section heading */}
      <h2>Analysis Result</h2>


      {/* =====================================
          1. ATS / MATCH SCORE
          ===================================== */}

      <div className="score-box">

        <h3>ATS / Match Score</h3>

        {/* 
          `result.score` dummy data se 78
          lekar yahan display karega.
        */}
        <p>{result.score}%</p>

      </div>


      {/* =====================================
          2. MATCHING + MISSING SKILLS
          ===================================== */}

      <div className="skills-grid">

        {/* -------- Matching Skills -------- */}

        <div className="result-box">

          <h3>Matching Skills</h3>

          <div className="skills-list">

            {result.matchingSkills.map((skill, index) => (
              <span key={index}>
                {skill}
              </span>
            ))}

          </div>

        </div>


        {/* -------- Missing Skills -------- */}

        <div className="result-box">

          <h3>Missing Skills</h3>

          <div className="skills-list">

            {result.missingSkills.map((skill, index) => (
              <span key={index}>
                {skill}
              </span>
            ))}

          </div>

        </div>

      </div>


      {/* =====================================
          3. AI SUGGESTIONS
          ===================================== */}

      <div className="result-box suggestions-box">

        <h3>AI Suggestions</h3>

        {result.suggestions.map((suggestion, index) => (
          <p key={index}>
            • {suggestion}
          </p>
        ))}

      </div>

    </div>

  </section>
)}

        <section className="features" id="features">
          <h2>What You'll Get</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div>📊</div>
              <h3>Resume Score</h3>
              <p>
                Get an AI-powered analysis score based on the job description.
              </p>
            </div>

            <div className="feature-card">
              <div>🎯</div>
              <h3>Skill Matching</h3>
              <p>
                Identify skills that match the requirements of the job.
              </p>
            </div>

            <div className="feature-card">
              <div>💡</div>
              <h3>AI Suggestions</h3>
              <p>
                Get practical suggestions to improve your resume.
              </p>
            </div>
          </div>
        </section>
  </main>

      <footer>
        <p>© 2026 ResumeAI — AI Resume Analyzer</p>
      </footer>
    </div>
  );
}

export default App;