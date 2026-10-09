require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer"); //need to use multer
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

// gemini AI setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


const app = express();
const PORT = process.env.PORT || 5000;
// middleware
app.use(cors()); // CORS browser ko batata hai ki ek origin se doosre origin par request/response ko allow kiya ja sakta hai ya nahi.
app.use(express.json()); // middleware for read JSON by express
// Multer configuration 
// File permanently save nahi hogi.
// File RAM mein rahegi.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

//analyze resume API
app.post("/api/analyze",upload.single('resume'), async (req, res) => {

  try{
        // Check whether resume was uploaded
        if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume PDF."
      });
    }


    // get Job description
    const jobDescription = req.body.jobDescription;


    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Please provide a job description."
      });
    }

    console.log("Resume:", req.file.originalname);
    console.log("Job Description:", jobDescription);

     //1. Resume PDF buffer, for read binary data of file which are in ram by multer
    const resumeBuffer = req.file.buffer;

     // 2. Create PDF parser
    const parser = new PDFParse({
      data: resumeBuffer
    });

    // 3. Extract text from PDF return a object 
    const result = await parser.getText(); // parser return a object

    //  Store extracted resume text (string)
const resumeText = result.text;

//console.log("Resume Text:");
//console.log(resumeText);

     // Free parser resources
    await parser.destroy();

  // 4.  Create AI prompt
  const prompt = `
You are an expert resume analyzer and career assistant.

Analyze the following resume according to the given job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON.

The JSON must follow exactly this structure:

{
  "score": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

1. "score":
Give a realistic resume-to-job match score from 0 to 100.

2. "matchingSkills":
List important skills from the job description that are present in the resume.

3. "missingSkills":
List important skills from the job description that are missing from the resume.

4. "suggestions":
Give practical suggestions to improve the resume for this particular job.

Keep the analysis honest.
Do not invent skills that are not present in the resume.
Do not include markdown.
Do not include explanations outside the JSON.

Return only the JSON object.
`;


  // STEP 5: Send data to Gemini
  const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      //Hum Gemini ko bol rahe hain ki apna answer JSON format mein dena.
      config: {
    responseMimeType: "application/json"
  }
    });

    const analysisText = response.text.trim();

    // Gemini ke JSON response ko backend ke andar JavaScript object mein convert karo
     const analysis = JSON.parse(analysisText);


  // STEP 6: Send AI result to frontend//temporary response
    res.json({
    message: "Resume parsed successfully",
    fileName: req.file.originalname,
    jobDescription:jobDescription,
     score: analysis.score,
    matchingSkills: analysis.matchingSkills,
    missingSkills: analysis.missingSkills,
     suggestions: analysis.suggestions     //analysis: response.text    //resumeText: resumeText
  });

}
  catch (error) {

    console.error("Error while parsing resume:", error);

    res.status(500).json({
      message: "Something went wrong while processing the resume."
    });
 
  }

});

// global error handler  or Ye global backup/error handler ki tarah hai.
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: error.message || "Something went wrong"
  });
});

//text api
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!"
  });
});

// Gemini AI test route
app.get("/api/ai-test", async (req, res) => {
  try {
    //api call start
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Explain React.js in one simple sentence."
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: "Gemini API test failed."
    });
  }
});




// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});