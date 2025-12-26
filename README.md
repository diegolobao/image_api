# Image Generation API

API RESTful para geração automatizada de imagens para redes sociais (Instagram Feed).

## Funcionalidades

- **Geração de Posts**: Cria imagens com sobreposição de texto (Título e Corpo).
- **Templates**: Suporte a templates pré-definidos (ex: `nutrition-feed`).
- **Fundo Dinâmico**: Aceita uma URL de imagem externa para usar como fundo.
- **Formato Nativo**: Otimizado para o formato 1080x1350 (Retrato Instagram).
- **Redimensionamento Inteligente**: Imagens de qualquer tamanho são redimensionadas e cortadas automaticamente para preencher o formato 1080x1350.

## Como Usar

### 1. Setup Local

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Configure o arquivo `.env` (crie se não existir):
    ```env
    PORT=3000
    API_KEY=my-secret-api-key
    BASE_URL=http://localhost:3000
    ```
3.  Inicie o servidor:
    ```bash
    npm start
    ```

### 2. Endpoint de Geração

**POST** `/api/generate-post`

**Headers:**
- `Content-Type`: `application/json`
- `x-api-key`: `sua-chave-api` (definida no .env)

**Body (JSON):**

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `template_id` | String | ID do template. Use `nutrition-feed`. |
| `texts` | Object | Objeto contendo `title` e `body`. |
| `image_url` | String | (Opcional) URL da imagem de fundo. Se omitido, usa o fundo padrão. |

### 3. Exemplos de Uso

#### Exemplo com Fundo Dinâmico (Recomendado)

Gera um post usando uma imagem da internet como fundo. O sistema ajustará a imagem para 1080x1350.

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/generate-post" `
  -Method Post `
  -Headers @{"x-api-key"="my-secret-api-key"} `
  -ContentType "application/json" `
  -Body '{"template_id": "nutrition-feed", "texts": {"title": "Frutas", "body": "Energia Pura"}, "image_url": "https://v3b.fal.media/files/b/lion/zEsDfwh60McbhwIAERBiJ.jpg"}'
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{
    "template_id": "nutrition-feed",
    "texts": {
        "title": "Frutas",
        "body": "Energia Pura"
    },
    "image_url": "https://v3b.fal.media/files/b/lion/zEsDfwh60McbhwIAERBiJ.jpg"
}'
```

#### Exemplo com Fundo Padrão

Se não fornecer `image_url`, o sistema usará o fundo padrão configurado no template.

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/generate-post" `
  -Method Post `
  -Headers @{"x-api-key"="my-secret-api-key"} `
  -ContentType "application/json" `
  -Body '{"template_id": "nutrition-feed", "texts": {"title": "Legumes", "body": "Saudáveis"}}'
```

## Configuração de Templates

Os templates são definidos em `config/templates.js`.

**Template Atual (`nutrition-feed`):**
- **Fonte:** Bebas Neue (Bold)
- **Cor do Título:** #6c6c6c
- **Cor do Corpo:** #9f9f9f
- **Posição Título:** x=50, y=315
- **Posição Corpo:** x=50, y=496

## Observações de Infraestrutura

### Testing with PowerShell

To correctly send accented characters (UTF-8) via PowerShell, you must set the encoding preferences first. You can use the provided helper script:

```powershell
.\test_request.ps1
```

Or manually:

```powershell
$OutputEncoding = [System.Text.Encoding]::UTF8
Invoke-RestMethod -Uri "http://localhost:3000/api/generate-post" ...
```

## Integração com n8n

Para integrar com workflows do n8n, utilize o nó **HTTP Request**.

### Configuração do Nó "HTTP Request"

1.  **Method**: `POST`
2.  **URL**: `https://image_api.pontowebmarketing.com.br/api/generate-post`
    *   *(Substitua pela URL real que você obteve no Coolify)*
3.  **Authentication**:
    *   Authentication Type: `Generic Credential Type`
    *   Credential Type: `Header Auth`
    *   Create New Credential:
        *   **Name**: `x-api-key`
        *   **Value**: `my-secret-api-key` (sua chave do .env)
4.  **Send Headers**: `Active`
    *   **Header Name**: `Content-Type`
    *   **Value**: `application/json; charset=utf-8`
    *   *Nota: Esse header é crucial para que acentos (á, é, ã) funcionem corretamente.*
5.  **Body Content Type**: `JSON`
6.  **Json Body**:
    ```json
    {
      "template_id": "nutrition-feed",
      "texts": {
        "title": "{{ $json.titulo }}",
        "body": "{{ $json.texto }}"
      },
      "image_url": "{{ $json.url_imagem_fundo }}"
    }
    ```
    *(Você pode arrastar as variáveis do nó anterior para preencher os campos dinamicamente)*.

### Saída Esperada
O nó retornará um JSON:
```json
{
  "url": "https://sua-url.com/public/generated/uuid-da-imagem.png"
}
```
Você pode usar essa URL no próximo nó (ex: postar no Instagram, Telegram, etc).
