const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello Agent Wallboard!');
});

// ✅ เพิ่ม route /health
app.get('/health', (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
