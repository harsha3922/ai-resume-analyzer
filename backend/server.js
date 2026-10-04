require("dotenv").config();
const express = require("express");
const multer = require("multer"); //need to use multer
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const app = express();

const PORT = 5000;

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


  // Job description
    const jobDescription = req.body.jobDescription;

    console.log("Resume:", req.file.originalname);
    console.log("Job Description:", jobDescription);

     // Resume PDF buffer, for read binary data of file which are in ram by multer
    const resumeBuffer = req.file.buffer;

     // Create PDF parser
    const parser = new PDFParse({
      data: resumeBuffer
    });

    // Extract text from PDF
    const result = await parser.getText(); // parser return a object

    // Store extracted resume text
const resumeText = result.text;

console.log("Resume Text:");
console.log(resumeText);

     // Free parser resources
    await parser.destroy();


    //temporary response
    res.json({
    message: "Resume parsed successfully",
    fileName: req.file.originalname,
    jobDescription:jobDescription,
     resumeText: resumeText
  });
     }
      catch (error) {

    console.error("Error while parsing resume:", error);

    res.status(500).json({
      message: "Something went wrong while processing the resume."
    });
          }

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
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});