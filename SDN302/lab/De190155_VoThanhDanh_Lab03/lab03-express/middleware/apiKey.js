export default function apiKey(req, res, next) {
    if (!req.headers['x-api-key']) {
        return res.status(401).json({ message: 'Missing API key' });
    }

    next();
}
