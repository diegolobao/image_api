const imageService = require('../services/imageService');

exports.generatePost = async (req, res) => {
    try {
        const { template_id, texts, image_url, styles } = req.body;
        console.log('Body:', JSON.stringify(req.body, null, 2));

        if (!template_id || !texts) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing template_id or texts',
                error_code: 'MISSING_PARAMETERS'
            });
        }

        const imageUrl = await imageService.generateImage(template_id, texts, image_url, styles);
        res.json({
            status: 'success',
            url: imageUrl,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error generating post:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            error_code: 'INTERNAL_SERVER_ERROR'
        });
    }
};
