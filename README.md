
An https API that calls itself, hashes txt files as well and compares the resulting hash, self signed certificates included because I like https more than http, doesn't mean more security though at this point it's just fashion.

# Set Up:
if you want to run the server in https use WSL on windows or use a unix machine:
```
~$ openssl genrsa -des3 -out ca.key 2048 #this will prompt a PEM password enter it
~$ openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.crt #enter the password from the previous step, then enter sensible values or just  leave the field blank
~$ openssl genrsa -out localhost.key 2048
~$ openssl req -new -key localhost.key -out localhost.csr -addext "subjectAltName = DNS:localhost" #repeat step 2

At the moment we have created 4 files in the root directory of the server.
Now enter the following in terminal:
~$ openssl x509 -req -in localhost.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out localhost.crt -days 365 -sha256 -extfile localhost.ext #on prompt enter the PEM password from the first step
```
and then navigate to server.js comment or delete anything related to starting the server then add the following:
```
// start server
let server = https.createServer(httpsOptions, app);
// set port, listen for requests
server.listen(3000, ()=>{
  console.log('I am listening.....');
})
```
P.S: you will need to install run:
```
npm install https
const https = require('https'); //add this to the top of the server with the other requires
```
```
npm install
node server.js
```

# Testing

using POSTMAN, navigate to body ==> form data here is what the endpoint 3 request looks like, you can use the same files or different files the API will tell you if they have the same hashes:


![image](https://github.com/Ahmedouu/autoAPI/assets/33392644/bd12d896-42bf-46b5-987f-76ece2323600)

Here is an example of curl for endpoint 2 if you prefer curl:
```
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/your/file" http://localhost:3000/api/data2

```

To test endpoint1, you can go to /utils and replace the randomFile.txt by any file you want just make sure to rename it to randomFile.txt, and send a GET request.
You can use Invoke-WebRequest as well for endpoint 1:
```

$url = "http://localhost:3000/api/data1"

$response = Invoke-WebRequest -Uri $url -Method Get

# Print the response bod
Write-Output $response.Content
```
But for 2 and 3 I think that would be another project on it's own.

# Note:

You can also use html files if you like the hashing function takes cares of normalizing html files as well.
