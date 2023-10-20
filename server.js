const express = require('express');
const app = express();
const fs = require('fs')
const {HASHER} = require('./utils/hashing')
const filePath = './utils/randomFile.txt'
app.use(express.json());
const axios = require('axios');
const multer = require('multer')
const upload = multer();
let hash;


// endpoint 1 // this endpoint takes a file and hashes it and returns the hash of the file 
app.get('/api/data1',  (req, res) => {
  try  
  {fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('There was an error reading the file!', err);
      return;
    }
    const hashedContent = HASHER(data);
    console.log(hashedContent);
    hash = hashedContent
    res.status(201).json({ hashedFile: hash });
  });
}
 catch (error){
  res.status(505).json({error})
 }
  
  
  });

// endpoint 2 //this endpoint takes another files and hashes it and compares it to the hash from endpoint 1
app.post('/api/data2', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer; 
  await axios.get('http://localhost:3000/api/data1')
  .then(response => {
    console.log(response.data['hashedFile']);
    hash = response.data['hashedFile']
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
  console.log(req.body); 
  res.status(201).json({ message: `File received at endpoint 2${hash}` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
