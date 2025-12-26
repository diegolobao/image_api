$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Invoke-RestMethod -Uri "http://localhost:3000/api/generate-post" `
  -Method Post `
  -Headers @{"x-api-key" = "my-secret-api-key" } `
  -ContentType "application/json; charset=utf-8" `
  -Body '{"template_id": "nutrition-feed", "texts": {"title": "EQUILÍBRIO", "body": "FESTIVO"}, "image_url": "https://v3b.fal.media/files/b/0a87c1ef/qkTmjugWnSsS7lsKnfSEA.png"}'
