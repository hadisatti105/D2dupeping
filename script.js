document.getElementById('phoneForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const phone = document.getElementById('clientPhone').value.trim();
  const msgBox = document.getElementById('responseMsg');

  if (!phone) {
    msgBox.textContent = 'Please enter a phone number.';
    msgBox.style.color = 'red';
    return;
  }

  const apiUrl = `https://d2dupeping.onrender.com/submit/${encodeURIComponent(phone)}`;

  try {
    const response = await fetch(apiUrl);

    const contentType = response.headers.get('content-type');

    let responseBody;

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json(); // API returned JSON
    } else {
      responseBody = await response.text(); // API returned plain text
    }

    if (!response.ok) {
      msgBox.textContent = `API Error: ${response.status} - ${JSON.stringify(responseBody)}`;
      msgBox.style.color = 'red';
    } else {
      msgBox.textContent = `✅ API Success: ${typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody}`;
      msgBox.style.color = 'green';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    msgBox.textContent = `❌ Network error: ${error.message}`;
    msgBox.style.color = 'red';
  }
});
