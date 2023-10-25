const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const {HASHER} = require('./utils/hashing')
const filePath = './utils/randomFile.txt'
app.use(express.json());
const axios = require('axios');
const multer = require('multer')
const FormData = require('form-data');
const upload = multer();
let hash;


//https options 
const httpsOptions = {
	cert: fs.readFileSync('./localhost.crt'),
	key: fs.readFileSync('./localhost.key')
  };

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  }); 



// endpoint 1 // this endpoint takes a file and hashes it and returns the hash of the file 
app.get('/api/data1',  (req, res) => {

  if (req.protocol === 'https') {
    console.log(req.socket.getProtocol());
} else {
    console.log('Not SSL');
}
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
app.post('/api/data2', upload.any(), async (req, res) => {
  
  //Using any with multer is not very secure but I don't care about that just yet, we need to be able upload any file and dynamically find the file name.

  let fileBuffer;

  // find the file field 
  const fileField = req.files.find(file => ['file', 'file2'].includes(file.fieldname));
  
  if (fileField) {
    fileBuffer = fileField.buffer;
  } else {
    res.status(400).send('No file received.');
  }
  const fileContent = fileBuffer.toString('utf8'); // convert buffer to string
  const newHashedContent = HASHER(fileContent); // hash the content
  
  await axios.get('https://localhost:3000/api/data1', {httpsAgent})
  .then(response => {
    console.log('cest tres chelo tu sais mira',response.data['hashedFile']);
    hash = response.data['hashedFile']
  })
  .catch(error => {
    console.error('error in calling myself:', error);
  });
  if (newHashedContent === hash){
    console.log("oooh baby what is good")
    res.status(200).send('hmm the hashes do be matching')

  }
  else {
    res.send("the hashes don't match big guy")
  }
});


//endpoint 3// this endpoint takes two files and hashes both of them and calls itself on endpoint 1 to find the hash of the file we have on the server
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
    res.status(200).send("All hashes are equal");
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

  //res.status(201).json({ message: ` hashes of files 1 and 2 respectively: ${newHashedContent2} -- ${newHashedContent1}` });
});

//this endpoint is going to take two files as input and pass one of them to endpoint 2 and returns what 
app.post('/api/data4', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async (req, res) => {
  
  const file1Buffer = req.files.file1[0].buffer; 

  const fileBuffer = req.files.file2[0].buffer;

  let data = new FormData();

  try {
  data.append('file2', fileBuffer, req.files.file2[0].originalname);
  } catch (err){
    console.error("couldn't append file sorry")
  }
  
  // Send the POST request to /api/data2
  await axios.post('http://localhost:3000/api/data2', data, {
    headers: {
      ...data.getHeaders()
    }
  })
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the request.');
  });
});


//endpoint 5 // upload as many files as you like hash all of them but beware this code is O(n^2)



// start server
let server = https.createServer(httpsOptions, app);
// set port, listen for requests
server.listen(3000, ()=>{
  console.log('I am listening.....');
})