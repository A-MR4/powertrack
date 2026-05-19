async function postReading() {
  const url = 'http://localhost:3000/api/readings';
  const payload = {
    consumption: 4.75,
    current: 19.8,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', result);
}

postReading().catch((error) => {
  console.error('Error sending reading:', error);
});
