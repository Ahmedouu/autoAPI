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
  const fileContent = fileBuffer.toString('utf8'); // convert buffer to string
  const newHashedContent = HASHER(fileContent); // hash the content
  console.log(`c est chelou tu sais mira ${newHashedContent}`)
  await axios.get('http://localhost:3000/api/data1')
  .then(response => {
    console.log(response.data['hashedFile']);
    hash = response.data['hashedFile']
  })
  .catch(error => {
    console.error('Error:', error);
  });
  if (newHashedContent === hash){
    res.status(201).send('hmm the hashes do be matching')

  }
  else {
    res.send("the hashes don't match big guy")
  }
});


//endpoint 3// this endpoint takes two files and hashes both of them and tells you some info about the files
app.post('/api/data3', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async (req, res) => {
  
  const file1Buffer = req.files.file1[0].buffer; 
  const file2Buffer = req.files.file2[0].buffer; 
  const fileContent1 = file1Buffer.toString('utf8'); 
  const newHashedContent1 = HASHER(fileContent1);
  const fileContent2 = file2Buffer.toString('utf8'); 
  const newHashedContent2 = HASHER(fileContent2);


  await axios.get('http://localhost:3000/api/data1')
  .then(response => {
    console.log(response.data['hashedFile']);
    hash = response.data['hashedFile']
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
  try {
  if (hash === newHashedContent1 && newHashedContent1 === newHashedContent2) {
    console.log("All hashes are equal");
} else {
    if (hash === newHashedContent1) {
        res.status(200).send("file1 matches the file we have in the server");
    }
    if (hash === newHashedContent2) {
        res.status(200).send("file2 matches the file we have in the server");
    }
    if (newHashedContent1 === newHashedContent2) {
        res.status(200).send("file1 and file2 are a match");
    }
}}
  catch(error){
    res.status(505).send(error)
  }

  res.status(201).json({ message: ` hashes of files 1 and 2 respectively: ${newHashedContent2} -- ${newHashedContent1}` });
});


//endpoint 4 // upload as many files as you like hash all of them but beware this code is O(n^2)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
