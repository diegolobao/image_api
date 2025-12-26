const imageService = require('../services/imageService');

exports.generatePost = async (req, res) => {
    try {
        const { template_id, texts, image_url, styles } = req.body;
        console.log('Body:', JSON.stringify(req.body, null, 2));

        if (!template_id || !texts) {
            return res.status(400).json({ error: 'Missing template_id or texts' });
        }

        const imageUrl = await imageService.generateImage(template_id, texts, image_url, styles);
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error generating post:', error);
        res.status(500).json({ error: error.message });
    }
};
