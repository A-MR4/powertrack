(async () => {
  try {
    const url = 'http://localhost:3002/api/readings';
    const payload = {
      consumption: 4.75,
      current: 19.8,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();
