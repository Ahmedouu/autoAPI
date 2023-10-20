const express = require('express');
const app = express();
const multer  = require('multer');
app.use(express.json());



// endpoint 1
app.post('/api/data1', upload.single('file'), async (req, res) => {
    console.log(req.file); // log the received file
    res.status(201).json({ message: 'File received at endpoint 1', file: req.file });
  });

// endpoint 2
app.post('/api/data2', (req, res) => {
  console.log(req.body); // log the received data
  res.status(201).json({ message: 'Data received at endpoint 2', data: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
