const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

// Allow requests from your frontend
app.use(cors());

// Simple check route
app.get('/', (req, res) => {
  res.send('✅ Ping Web Form Server is Running');
});

// Submit route to proxy to the external API
app.get('/submit/:phone', async (req, res) => {
  const phone = req.params.phone;

  const apiUrl = `https://pointe.tldcrm.com/api/vendor/ping/31094/0fd12db837e970f03326c27311b7bc56/${encodeURIComponent(phone)}`;

  console.log(`➡️ Calling external API: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl); // ✅ Native fetch
    const resultText = await response.text();

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}: ${resultText}`);
      return res.status(response.status).send(`External API error: ${resultText}`);
    }

    console.log(`✅ API Success: ${resultText}`);
    res.status(200).send(resultText);

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
});
