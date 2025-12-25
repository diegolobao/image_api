const http = require('http');

const data = JSON.stringify({
    template_id: 'nutrition-feed',
    texts: {
        title: 'Bebidas',
        body: 'Refrescantes'
    },
    image_url: 'https://v3b.fal.media/files/b/lion/zEsDfwh60McbhwIAERBiJ.jpg'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-post',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-api-key': 'my-secret-api-key'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
