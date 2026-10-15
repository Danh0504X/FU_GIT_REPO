export default function validateBook(req, res, next) {
    const {
        title,
        price,
        category
    } = req.body;

    if (!title) {
        return res.status(400)
            .json({
                message: "Title is required"
            });
    }
    if (typeof price !== "number"
        || price <= 0) {
        return res.status(400)
            .json({
                message: "Price must be positive"
            });
    }

    const categories = [
        "Programming",
        "Novel",
        "Education"
    ];

    if (!categories.includes(category)) {
        return res.status(400)
            .json({
                message: "Invalid category"
            });
    }
    next();
}
