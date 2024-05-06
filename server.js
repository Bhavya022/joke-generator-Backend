const express = require('express');
const app = express();
require("dotenv").config();
const cors = require("cors");
const fetch = require('isomorphic-fetch'); // Import isomorphic-fetch
app.use(cors());
app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Set port from environment variable or default to 8080
const port = process.env.PORT || 8080;
//op = sk-proj-JwXHDGT31L2aGqgyUxHIT3BlbkFJMt0ECI7N8Skm5sImNlNN
// // API endpoint to generate jokes
app.get('/',async(req,res)=>{
  res.send('welcome to Joke-Generator')
})
app.post('/generate-joke', async (req, res) => {
  try {
    // Extract keyword from request body
    console.log(req.body);
    if (!req.body.keyword) {
      return res.status(400).json({ message: 'Missing keyword in request body' });
    }
    const keyword = req.body.keyword;

    // Check if API key is set in environment variable
    const API_KEY = 'AIzaSyDIRX6yaJpb4bqQuK0LleGnndj0pM69pgA';
    if (!API_KEY) {
      return res.status(401).json({ message: 'Missing G_API_KEY environment variable' });
    }

    // Create GoogleGenerativeAI instance with API key and fetch function
    const genAI = new GoogleGenerativeAI(API_KEY, { fetch }); // Pass fetch as an option

    async function generateJoke() {
      try {
        // Get the Gemini Pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prompt: Include keyword
        const prompt = `Tell me a joke about ${keyword}`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extract generated joke
        const joke = await response.text() || 'Could not generate joke at this time.';
        return joke;
      } catch (error) {
        console.error('Error generating joke:', error);
        throw error; // Re-throw for handling in main function
      }
    }

    // Generate joke and send response
    const joke = await generateJoke();
    res.json({ joke });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
