FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    curl \
    fontconfig \
    fonts-liberation \
    && mkdir -p /usr/share/fonts/truetype/google-fonts \
    && curl -L "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf" -o /usr/share/fonts/truetype/google-fonts/BebasNeue-Regular.ttf \
    && fc-cache -f -v \
    && rm -rf /var/lib/apt/lists/*

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
