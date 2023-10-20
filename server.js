const express = require('express');
const app = express();
app.use(express.json());

// endpoint 1
app.post('/api/data1', (req, res) => {
  console.log(req.body); // log the received data
  res.status(201).json({ message: 'Data received at endpoint 1', data: req.body });
});

// endpoint 2
app.post('/api/data2', (req, res) => {
  console.log(req.body); // log the received data
  res.status(201).json({ message: 'Data received at endpoint 2', data: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
