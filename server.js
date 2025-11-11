const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin requests (safe for most environments)
app.use(cors());

// Serve static frontend files from /public (e.g. index.html, script.js)
app.use(express.static(path.join(__dirname, 'public')));

// Health check route (optional, root path)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API proxy route: GET /submit/:phone
app.get('/submit/:phone', async (req, res) => {
  const phone = req.params.phone;

  const apiUrl = `https://pointe.tldcrm.com/api/vendor/ping/31094/0fd12db837e970f03326c27311b7bc56/${encodeURIComponent(phone)}`;

  console.log(`➡️ Calling external API: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl); // Native fetch in Node.js v18+
    const resultText = await response.text();

    if (!response.ok) {
      console.error(`❌ External API Error (${response.status}): ${resultText}`);
      return res.status(response.status).send(`External API error: ${resultText}`);
    }

    console.log(`✅ API Success: ${resultText}`);
    res.status(200).send(resultText);
  } catch (error) {
    console.error('❌ Server Error:', error.message);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
