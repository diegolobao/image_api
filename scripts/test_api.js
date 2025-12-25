const http = require('http');

const data = JSON.stringify({
    template_id: 'default',
    texts: {
        title: 'Hello World',
        body: 'This is a test post'
    }
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
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
