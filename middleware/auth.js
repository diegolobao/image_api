module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
