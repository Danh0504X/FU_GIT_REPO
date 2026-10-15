import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            minlength: [3, "Category name must have at least 3 characters"]
        },


        description: {
            type: String,
            maxlength: [
                300,
                "Description cannot exceed 300 characters"
            ]
        },


        isActive: {
            type: Boolean,
            default: true
        },


        createdBy: {
            type: String,
            default: "Admin"
        }

    },


    {
        timestamps: true
    }

);



const Category = mongoose.model(
    "Category",
    categorySchema
);


export default Category;