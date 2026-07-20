const express = require('express');
const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: "Success", status: 200 });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
