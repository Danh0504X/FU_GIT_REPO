export function errorHandler(err, req, res, next){
    console.log(err);

    if(err.name === "ValidationError"){
        const errors = Object.keys(err.errors)
            .map(field => ({
                field: field,
                message: err.errors[field].message
            }));
        return res.status(400).json({
            message:"Validation failed",
            errors:errors
        });
    }

    if(err.name === "CastError"){
        return res.status(400).json({
            message:"Invalid ID format"
        });
    }

    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message:"Duplicate value",
            field:field
        });
    }
    res.status(500).json({
        message:"Internal server error",
        error:err.message
    });
}
