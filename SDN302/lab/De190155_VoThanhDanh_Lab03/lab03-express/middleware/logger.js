export default function logger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const elapsed = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${elapsed}ms`);
    });

    next();
}
