const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.WS_PORT || 3001;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/new-reading') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const message = JSON.stringify({ type: 'new-reading', reading: payload.reading || payload });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('invalid');
      }
    });
    return;
  }

  // simple status page
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WS server running');
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
  console.log('Client connected via WebSocket');
  socket.send(JSON.stringify({ type: 'hello', message: 'Welcome to PowerTrack WS' }));

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on http://localhost:${PORT}`);
});
