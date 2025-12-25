const http = require('http');

const data = JSON.stringify({
    template_id: "nutrition-feed",
    texts: {
        title: "Férias",
        body: "Sem Culpa"
    },
    image_url: "https://v3b.fal.media/files/b/0a87c093/KvjPCggMG11yxKqCaS3Ly.png"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-post',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': 'my-secret-api-key'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
