const sharp = require('sharp');
const path = require('path');

async function checkMetadata() {
    try {
        const userImage = 'test_download.jpg';
        const templateImage = path.join('templates', 'exemplo_modelo.jpg');

        console.log('--- User Image ---');
        const userMeta = await sharp(userImage).metadata();
        console.log(`Dimensions: ${userMeta.width}x${userMeta.height}`);
        console.log(`Format: ${userMeta.format}`);

        console.log('\n--- Template Image ---');
        const templateMeta = await sharp(templateImage).metadata();
        console.log(`Dimensions: ${templateMeta.width}x${templateMeta.height}`);
        console.log(`Format: ${templateMeta.format}`);
    } catch (error) {
        console.error(error);
    }
}

checkMetadata();
