#Check existence and redabitility of file

$filePath = 'C:\\Users\\USER\\autoAPI\\utils\\randomFile.txt'
if (Test-Path $filePath) {
    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
        $fileEnc = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes)
        Write-Output $fileEnc
    } catch {
        Write-Output "Error reading file: $_"
    }
} else {
    Write-Output "File not found: $filePath"
}

#Test endpoint 1


$url = "http://localhost:3000/api/data1"

$response = Invoke-WebRequest -Uri $url -Method Get

# Print the response bod
Write-Output $response.Content

# check existence of a file
$filePath = 'C:\\Users\\USER\\autoAPI\\utils\\randomFile.txt' #change this
if (Test-Path $filePath) {
    Write-Output "File exists: $filePath"
} else {
    Write-Output "File not found: $filePath"
}

# Test endpoint 2 api/data2
$FilePath = 'C:\\Users\\USER\\Downloads\\TextDOC.txt' #change this
$URL = 'http://localhost:3000/api/data2'

$fileBytes = [System.IO.File]::ReadAllBytes($FilePath);
$fileEnc = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes);
$boundary = [System.Guid]::NewGuid().ToString(); 
$LF = "`r`n";

$bodyLines = ( 
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"temp.txt`"",
    "Content-Type: application/octet-stream$LF",
    $fileEnc,
    "--$boundary--$LF" 
) -join $LF

Invoke-RestMethod -Uri $URL -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines

#Test endpoint 3 api/data3

$FilePath1 = 'C:\\Users\\USER\autoAPI\\utils\\randomFile.txt' #change this
$FilePath2 = 'C:\\Users\\USER\autoAPI\\utils\\randomFile.txt' #change this
$URL = 'http://localhost:3000/api/data3'

$fileBytes1 = [System.IO.File]::ReadAllBytes($FilePath1);
$fileEnc1 = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes1);

$fileBytes2 = [System.IO.File]::ReadAllBytes($FilePath2);
$fileEnc2 = [System.Text.Encoding]::GetEncoding('UTF-8').GetString($fileBytes2);


$boundary = [System.Guid]::NewGuid().ToString();
$LF = "`r`n";


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

Invoke-RestMethod -Uri $URL -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines

###########################################
# Version 5 disable SSL certificate check

add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
