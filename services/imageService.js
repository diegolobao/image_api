const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const templates = require('../config/templates');

const TEMPLATE_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../public/generated');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

exports.generateImage = async (templateId, texts, imageUrl, styles = {}) => {
    console.log('Generating image with:', { templateId, imageUrl });

    // Fix for UTF-8 bytes interpreted as Latin-1 (Mojibake)
    // Common Portuguese characters: Á(C3 81) É(C3 89) Í(C3 8D) Ó(C3 93) Ú(C3 9A)
    // á(C3 A1) é(C3 A9) í(C3 AD) ó(C3 B3) ú(C3 BA) ã(C3 A3) õ(C3 B5) ç(C3 A7)
    // Ê(C3 8A) ê(C3 AA)
    if (texts.title) {
        const replacements = {
            'Ã©': 'é', 'Ã‰': 'É',
            'Ã¡': 'á', 'Ã\x81': 'Á',
            'Ã\xAD': 'í', 'Ã\x8D': 'Í',
            'Ã³': 'ó', 'Ã\x93': 'Ó',
            'Ãº': 'ú', 'Ã\x9A': 'Ú',
            'Ã£': 'ã', 'Ã\x83': 'Ã',
            'Ãµ': 'õ', 'Ã\x95': 'Õ',
            'Ã§': 'ç', 'Ã\x87': 'Ç',
            'Ãª': 'ê', 'Ã\x8A': 'Ê',
            'Ã´': 'ô', 'Ã\x94': 'Ô'
        };

        let fixedTitle = texts.title;
        for (const [bad, good] of Object.entries(replacements)) {
            // Use split/join for replaceAll behavior
            fixedTitle = fixedTitle.split(bad).join(good);
        }

        if (fixedTitle !== texts.title) {
            console.log(`Fixed encoding manually: "${texts.title}" -> "${fixedTitle}"`);
            texts.title = fixedTitle;
        }
    }

    // Deep clone to allow per-request modifications without affecting global config customStyles
    const baseConfig = templates[templateId] || templates['default'];
    const templateConfig = JSON.parse(JSON.stringify(baseConfig));

    // Apply style overrides if provided
    if (styles) {
        if (styles.title) {
            console.log('Applying custom styles for title:', styles.title);
            Object.assign(templateConfig.textConfig.title, styles.title);
        }
        if (styles.body) {
            console.log('Applying custom styles for body:', styles.body);
            Object.assign(templateConfig.textConfig.body, styles.body);
        }
    }
    let inputBuffer;

    if (imageUrl) {
        console.log('--- USING DYNAMIC IMAGE PATH ---');
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            inputBuffer = Buffer.from(arrayBuffer);
            console.log(`Dynamic image fetched. Size: ${inputBuffer.length} bytes`);

            // Resize downloaded image to standard size (e.g., 1080x1350) to ensure text positioning works
            inputBuffer = await sharp(inputBuffer)
                .resize(1080, 1350, { fit: 'cover' })
                .toBuffer();
        } catch (error) {
            console.error('Error fetching/processing dynamic image:', error);
            throw new Error('Failed to process dynamic background image');
        }
    } else {
        console.log('--- USING TEMPLATE PATH ---');
        const templatePath = path.join(TEMPLATE_DIR, templateConfig.filename);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templateConfig.filename}`);
        }
        inputBuffer = templatePath; // Sharp accepts path string
        console.log(`Using template file: ${templateConfig.filename}`);
    }

    const filename = `${crypto.randomUUID()}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Create SVG for text overlay
    // SVG Content Generation
    let defs = '';
    let extraElements = '';

    if (templateConfig.overlay && templateConfig.overlay.enabled) {
        defs += `
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${templateConfig.overlay.fromColor};stop-opacity:${templateConfig.overlay.fromOpacity}" />
                <stop offset="100%" style="stop-color:${templateConfig.overlay.toColor};stop-opacity:${templateConfig.overlay.toOpacity}" />
            </linearGradient>
        </defs>`;

        extraElements += `<rect x="0" y="${templateConfig.overlay.y}" width="1080" height="${templateConfig.overlay.height}" fill="url(#grad1)" />`;
    }

    const svgImage = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg width="1080" height="1350">
        ${defs}
        <style>
            .title { 
                fill: ${templateConfig.textConfig.title.color}; 
                font-size: ${templateConfig.textConfig.title.fontSize}px; 
                font-family: ${templateConfig.textConfig.title.fontFamily || 'sans-serif'}; 
                font-weight: bold;
                stroke: ${templateConfig.textConfig.title.stroke || 'none'};
                stroke-width: ${templateConfig.textConfig.title.strokeWidth || 0}px;
                letter-spacing: ${templateConfig.textConfig.title.letterSpacing || 0}px;
                paint-order: stroke fill;
            }
            .body { 
                fill: ${templateConfig.textConfig.body.color}; 
                font-size: ${templateConfig.textConfig.body.fontSize}px; 
                font-family: ${templateConfig.textConfig.body.fontFamily || 'sans-serif'}; 
                font-weight: bold;
                stroke: ${templateConfig.textConfig.body.stroke || 'none'};
                stroke-width: ${templateConfig.textConfig.body.strokeWidth || 0}px;
                letter-spacing: ${templateConfig.textConfig.body.letterSpacing || 0}px;
                paint-order: stroke fill;
            }
        </style>
        ${extraElements}
        <text x="${templateConfig.textConfig.title.left}" y="${templateConfig.textConfig.title.top}" class="title">${escapeHtml(texts.title || '')}</text>
        <text x="${templateConfig.textConfig.body.left}" y="${templateConfig.textConfig.body.top}" class="body">${escapeHtml(texts.body || '')}</text>
    </svg>
    `;

    const svgBuffer = Buffer.from(svgImage);

    await sharp(inputBuffer)
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .toFile(outputPath);

    // Schedule deletion
    setTimeout(() => {
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
            console.log(`Deleted temporary file: ${filename}`);
        }
    }, 5 * 60 * 1000); // 5 minutes

    return `${BASE_URL}/public/generated/${filename}`;
};

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function (m) {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            default: return m;
        }
    }).replace(/[^\x00-\x7F]/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
