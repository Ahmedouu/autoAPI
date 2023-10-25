const axios = require('axios')

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


axios.get('https://localhost:3000/api/data2', {httpsAgent})
.then(response => {
  console.log(response.data['hashedFile']);
  hash = response.data['hashedFile']
})
.catch(error => {
  console.error('Error:', error);
});