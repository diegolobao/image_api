# Guia de Deploy e Integração com n8n

## 1. Deploy na VPS com Coolify

O **Coolify** torna o deploy muito simples, similar ao Vercel/Netlify, mas na sua própria VPS.

### Passo 1: Subir o código para o GitHub/GitLab
O Coolify precisa baixar o código de algum lugar.
1. Crie um repositório no GitHub (privado ou público).
2. Envie os arquivos do projeto para lá:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin SEU_REPO_URL
   git push -u origin main
   ```

### Passo 2: Criar Projeto no Coolify
1. Acesse seu painel do Coolify.
2. Clique em **"+ Create New"** -> **"Project"**.
3. Escolha **"Production"** (ou o ambiente que desejar).
4. Clique em **"+ New Resource"**.
5. Selecione **"Application"** -> **"Public Repository"** (se seu repo for público) ou **"GitHub/GitLab App"** (se for privado e você tiver conectado a conta).
   * *Alternativa:* Se não quiser usar Git, você pode escolher **"Dockerfile"** e colar o conteúdo, mas via Git é o recomendado para atualizações automáticas.

### Passo 3: Configuração da Aplicação
1. Selecione o repositório e a branch (`main`).
2. O Coolify deve detectar automaticamente que é um projeto **Node.js** ou que tem um **Dockerfile**.
   * Se ele perguntar o "Build Pack", escolha **Dockerfile** (pois já criamos um otimizado).
3. **Porta**: Garanta que a porta exposta nas configurações ("Domains" ou "Networking") aponte para a porta interna **3000**.
4. **Environment Variables**:
   Vá na aba "Environment Variables" e adicione:
   * `API_KEY`: `my-secret-api-key` (ou a senha que você definou no .env)
   * `PORT`: `3000`
   * `BASE_URL`: `https://image_api.pontowebmarketing.com.br` (A URL do seu domínio, sem a barra no final. Em produção, isso é essencial para que o link da imagem gerada venha correto).

### Passo 4: Deploy
1. Clique em **"Deploy"**.
2. Aguarde o build terminar.
3. O Coolify irá gerar uma URL para você (algo como `https://image-api.seudominio.com` ou uma URL interna se você configurou assim).
4. Acesse essa URL no navegador com `/health` no final para testar: `https://sua-app.com/health`. Se responder `{"status":"ok"}`, está no ar!

---

## 2. Integração com n8n

Agora que sua API está online (seja via Coolify ou Localtunnel), configure o n8n para gerar as imagens.

### Nó: HTTP Request
Adicione um nó **HTTP Request** ao seu workflow e configure assim:

* **Method**: `POST`
* **URL**: `SUA_URL_DO_COOLIFY/api/generate-post`
  * *Exemplo*: `https://api-imagens.minhavps.com/api/generate-post`
* **Authentication**: Generic Credential Type -> **Header Auth**
  * **Name**: `x-api-key`
  * **Value**: `my-secret-api-key` (A mesma definida nas variáveis de ambiente do Coolify)
* **Headers** (Importante para acentos funcionarem):
  * **Name**: `Content-Type`
  * **Value**: `application/json; charset=utf-8`
* **Body Content Type**: `JSON`
* **Body Parameters**:
  ```json
  {
    "template_id": "nutrition-feed",
    "texts": {
      "title": "{{ $json.titulo }}",
      "body": "{{ $json.subtitulo }}"
    },
    "image_url": "{{ $json.imagem_fundo }}"
  }
  ```
  *(Substitua `{{ $json... }}` pelas variáveis que vêm dos nós anteriores do seu n8n)*.

### Testando
Execute o nó. Se tudo estiver correto, o nó retornará um JSON com a URL da imagem gerada:
```json
{
  "url": "https://api-imagens.minhavps.com/public/generated/abc-123-xyz.png"
}
```
Você pode então usar essa URL para postar no Instagram, enviar no Telegram, etc.
