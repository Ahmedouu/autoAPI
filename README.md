
An https API that calls itself, hashes txt files as well and compares the resulting hash, self signed certificates included after the fact because I like https more than http, doesn't mean more security though at this point it's just fashion.
The main goal of this project is fun, and to share with anyone who might be intrested how to use powershell to interact with REST apis.

# Set Up:
Ignore this and jump straight to One last install (highlighted) ... if you don't care about fake https (all https is fake btw).
if you want to run the server in https use WSL on windows or use a unix machine,
```
~$ openssl genrsa -des3 -out ca.key 2048 #this will prompt a PEM password enter it
~$ openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.crt #enter the password from the previous step, then enter sensible values or just  leave the field blank
~$ openssl genrsa -out localhost.key 2048
~$ openssl req -new -key localhost.key -out localhost.csr -addext "subjectAltName = DNS:localhost" #repeat step 2

At the moment we have created 4 files in the root directory of the server.
Now enter the following in terminal:
~$ openssl x509 -req -in localhost.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out localhost.crt -days 365 -sha256 -extfile localhost.ext #on prompt enter the PEM password from the first step
```
and then navigate to server.js comment or delete anything related to starting the server and the port assignment then add the following:
```
// start server
let server = https.createServer(httpsOptions, app);
// set port, listen for requests
server.listen(3000, ()=>{
  console.log('I am listening.....');
})
```
P.S: you will need to install https:
```
npm install https
```
then on top of server.js add the following: 
```
const https = require('https'); //add this to the top of the server with the other requires
```
# One last install to make sure we have everything then run the server:
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
But for 2 and 3 it's not very straightforward trying to send mutlipart/form-data using  Invoke-WebRequest or Invoke-RestMethod you will run into boundary errors if you attempt to do it the way curl does it, but you can if you want and here is how:

First of you all since you are using powershell you must be aware of funny windows is with the backslash ('/'), so we need to take that into account before getting to the intresting stuff, what seems to work for me when using powershell is the combination of single quotes '' and backslashes // for paths, I advise to use this script that checks if the file exists and is readable and properly encoded:
```
$filePath = 'C:\\path\\To\\autoAPI\\utils\\randomFile.txt' #single quotes and double backslashes. you can use this on other files as well
if (Test-Path $filePath) {
    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
        $fileEnc = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes) #convert the content into a string using UTF-8 encoding
        Write-Output "File Found and properly encoded"
    } catch {
        Write-Output "Error reading file: $_"
    }
} else {
    Write-Output "File not found: $filePath"
}
```
If you get any errors here check the path and alterante between using single quotes and double quotes, single backslash and double backslash until the file is found and readable.  
Afterwards you would need to use the following script to test endpoint 2:
```
$FilePath = 'C:\\path\\to\\File.txt' 
$URL = 'http://localhost:3000/api/data2'

# Read the file and encode it as a UTF-8 string
$fileBytes = [System.IO.File]::ReadAllBytes($FilePath);
$fileEnc = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes);

# Create a unique boundary for the multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString();
$LF = "`r`n";
# Construct the body of the POST request
$bodyLines = ( 
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"temp.txt`"",
    "Content-Type: application/octet-stream$LF",
    $fileEnc,
    "--$boundary--$LF" 
) -join $LF

# Send the POST reques
Invoke-RestMethod -Uri $URL -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines
```
You could also use Invoke-WebRequest but it will retunes the entire HTTP response you could declare a variable $reponse = Invoke-WebRequest .... and access the content using $response.Content.

To test endpoint 3 the same follows we just send two files this time:
```
$FilePath1 = 'C:\\path\\File1.txt'
$FilePath2 = 'C:\\path\\File2.txt'
$URL = 'http://localhost:3000/api/data3'

# Read the files and encode them as UTF-8 strings
$fileBytes1 = [System.IO.File]::ReadAllBytes($FilePath1);
$fileEnc1 = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes1);

$fileBytes2 = [System.IO.File]::ReadAllBytes($FilePath2);
$fileEnc2 = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes2);

# Create a unique boundary for the multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString();
$LF = "`r`n";

# Construct the body of the POST request
$bodyLines = ( 
    "--$boundary",
    "Content-Disposition: form-data; name=`"file1`"; filename=`"temp1.txt`"",
    "Content-Type: application/octet-stream$LF",
    $fileEnc1,
    "--$boundary",
    "Content-Disposition: form-data; name=`"file2`"; filename=`"temp2.txt`"",
    "Content-Type: application/octet-stream$LF",
    $fileEnc2,
    "--$boundary--$LF" 
) -join $LF

# Send the POST request
Invoke-RestMethod -Uri $URL -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines
```
To test api/data4 just use the same script and change the url.

You can find the powershell scripts in the root directory of the project for your convenience, and if you are wondering why anyone would go through all this just to send a POST request, there is good reason for me to do it, in testing I always end up sending the request before starting the server, Invoke-RestMethod understands that I am silly like that and lets the request fly out there long enough for me to realize the server is not running, saving me from the hassle of clicking enter again after starting the server.

# Note:

You can also use html files if you like the hashing function takes cares of normalizing html files as well.
