# Test Backend APIs
$idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiYTZlZmVmNWUxNzIxNDk5NzFhMmQzYWJiNWYzMzJlMGY3ODcxNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNDg1MjA2Mzk3MS1lN21uZTBvNHIydGFwNzZvdHVkcGE3NTRja3ZrZmhsOC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjI0ODUyMDYzOTcxLWc4aTBkdm9wYWUxb2loYTkwOGltZTg1Y3J0OHQybHJnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyMzY4ODYxMjg4NjczNjkwMjMwIiwiZW1haWwiOiJuZXRuZXRsaWZ5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiTmV0bGlmeSBOZXQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFdHZTJyR0c2WWk5cXJodjVHY2JGWFJTQ3Rpd1d5WDU3SEhDNXhBNGVGN05tREZBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik5ldGxpZnkiLCJmYW1pbHlfbmFtZSI6Ik5ldCIsImlhdCI6MTc2NzY5NDgwMSwiZXhwIjoxNzY3Njk4NDAxfQ.SrKheaNwlB38N-aZlXwARIYke100CaLUMTXYsN7r6Qt6lLAUAuG7601iJf6hVKBfC9YQ7X4R_MRc5t7jGFSTH6yY8x7ekuJZeh69JzDrkNfrH3o6MSUXWwe9WHpX48ReFneWhNt16d2cx6mq5SAlji-oblSFFplM27HGo7Z5Sv8Ze2tvJZpdo4JqAEPrKJ-I2SxUJHTVN657IMOWwoaTg0HJ3jeHYkcghAkT7gZpDpQBMMZxL9y8290w0oyQGc5zM4ztgU6rWvwo49IhG9IiY09Z48w9fukf-OfVVIqFblDKDBZMHRe8ak7uO81Wtcrkb04ghxfXNOfcCTdd6tMn8w"

Write-Host "Testing Sign-In..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/google" -Method Post -Body (@{ idToken = $idToken } | ConvertTo-Json) -ContentType "application/json"
$accessToken = $loginResponse.access_token

if ($accessToken) {
    Write-Host "Login Successful!" -ForegroundColor Green
    Write-Host "Access Token: $accessToken" -ForegroundColor Yellow
    
    $headers = @{ 
        Authorization = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }

    $date = Get-Date -Format "yyyy-MM-dd"
    Write-Host "`n1. Testing POST /slots (Create Slot)..." -ForegroundColor Cyan
    $slotData = @{
        date = $date
        startTime = "10:00 AM"
        endTime = "11:00 AM"
    } | ConvertTo-Json

    try {
        $newSlot = Invoke-RestMethod -Uri "http://localhost:3000/slots" -Method Post -Body $slotData -Headers $headers
        Write-Host "Slot Created Successfully!" -ForegroundColor Green
        $slotId = $newSlot.id
        $newSlot | ConvertTo-Json
    } catch {
        Write-Host "Failed to create slot: $_" -ForegroundColor Red
        return
    }

    Write-Host "`n2. Testing GET /slots (Fetch Slots)..." -ForegroundColor Cyan
    try {
        $slots = Invoke-RestMethod -Uri "http://localhost:3000/slots?date=$date" -Method Get -Headers $headers
        Write-Host "Slots Fetched Successfully!" -ForegroundColor Green
        $slots | ConvertTo-Json
    } catch {
        Write-Host "Failed to fetch slots: $_" -ForegroundColor Red
    }

    if ($slotId) {
        Write-Host "`n3. Testing DELETE /slots/$slotId (Remove Slot)..." -ForegroundColor Cyan
        try {
            $deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/slots/$slotId" -Method Delete -Headers $headers
            Write-Host "Slot Deleted Successfully!" -ForegroundColor Green
        } catch {
            Write-Host "Failed to delete slot: $_" -ForegroundColor Red
        }
    }

} else {
    Write-Host "Login Failed!" -ForegroundColor Red
}
