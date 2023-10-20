
An API that calls itself, hashes txt files as well.

# 1) Set Up:

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
