const axios = require('axios');

axios.get('http://localhost:3000/api/data1')
  .then(response => {
    console.log(response.data['hashedFile']);
  })
  .catch(error => {
    console.error('Error:', error);
  });
