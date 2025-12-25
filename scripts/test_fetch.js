const fs = require('fs');

async function testFetch() {
    const url = 'https://v3b.fal.media/files/b/lion/zEsDfwh60McbhwIAERBiJ.jpg';
    console.log(`Fetching ${url}...`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
            console.error('Fetch failed');
            return;
        }
        const buffer = await response.arrayBuffer();
        console.log(`Downloaded ${buffer.byteLength} bytes`);
        fs.writeFileSync('test_download.jpg', Buffer.from(buffer));
        console.log('Saved to test_download.jpg');
    } catch (error) {
        console.error('Error:', error);
    }
}

testFetch();
