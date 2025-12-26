$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$body = @{
    template_id = "nutrition-feed"
    texts       = @{
        title = "ESTILO CUSTOMIZADO"
        body  = "Funciona!"
    }
    image_url   = "https://v3b.fal.media/files/b/lion/zEsDfwh60McbhwIAERBiJ.jpg"
    styles      = @{
        title = @{
            color    = "#FF0000"
            fontSize = 150
            top      = 200
        }
        body  = @{
            color    = "#0000FF"
            fontSize = 80
            top      = 600
        }
    }
} | ConvertTo-Json -Depth 5

Write-Host "Sending payload:"
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate-post" `
        -Method Post `
        -Headers @{"x-api-key" = "my-secret-api-key" } `
        -ContentType "application/json; charset=utf-8" `
        -Body $body
      
    Write-Host "Response:"
    Write-Host ($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Response.ContentAsString
}
