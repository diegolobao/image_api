const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const templateDir = path.join(__dirname, '../templates');
if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir);
}

const output = path.join(templateDir, 'default.png');

sharp({
    create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 50, g: 50, b: 50, alpha: 1 }
    }
})
    .png()
    .toFile(output)
    .then(() => console.log('Default template created'))
    .catch(err => console.error(err));
