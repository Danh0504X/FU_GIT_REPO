import mongoose from "mongoose";


const authorSchema = new mongoose.Schema(

    {

        name:{
            type:String,
            required:[
                true,
                "Author name is required"
            ],
            minlength:[
                3,
                "Author name must have at least 3 characters"
            ],
            maxlength:[
                100,
                "Author name cannot exceed 100 characters"
            ]
        },


        bio:{
            type:String,
            maxlength:[
                500,
                "Bio cannot exceed 500 characters"
            ]
        },


        birthYear:{
            type:Number,

            validate:{
                validator:function(value){

                    return value <= new Date().getFullYear();

                },

                message:"Birth year cannot be in the future"
            }
        },


        nationality:{
            type:String,
            default:"Unknown"
        },


        isActive:{
            type:Boolean,
            default:true
        }

    },

    {

        timestamps:true

    }

);



const Author = mongoose.model(
    "Author",
    authorSchema
);


export default Author;