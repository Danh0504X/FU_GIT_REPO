import mongoose from "mongoose";


const bookSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: [true, "Book title is required"],
            minlength: [3, "Title must have at least 3 characters"],
            maxlength: [100, "Title cannot exceed 100 characters"]
        },


        isbn: {
            type: String,
            required: [true, "ISBN is required"],
            unique: true
        },


        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },


        publishedDate: {
            type: Date,
            required: [true, "Published date is required"],
            validate:{
                validator: function(value) {
                    return value <= new Date();
                },
            message:"Published date cannot be in the future"
            }
        },


        language: {
            type: String,
            enum: {
                values: [
                    "English",
                    "Vietnamese",
                    "Japanese"
                ],
                message: "Language is not supported"
            },
            default: "English"
        },


        isAvailable: {
            type: Boolean,
            default: true
        },


        pages: {
            type: Number,
            min: [1, "Pages must be greater than 0"],
            max: [5000, "Pages cannot exceed 5000"]
        },


        tags: {
            type: [String],
            default: []
        },


        description: {
            type: String,
            maxlength: [500, "Description too long"]
        }

    },


    {

    timestamps:true,

    toJSON:{
        virtuals:true
    },

    toObject:{
        virtuals:true
    }

});


// middleware

bookSchema.pre("save", function(){

    this.title = this.title.trim();

    this.title =
        this.title.charAt(0).toUpperCase()
        + this.title.slice(1);



});


bookSchema.post("save", function(doc){

    console.log(
        `New book created: ${doc._id}`
    );

});


// instance

bookSchema.methods.getSummary=function(){

    return `${this.title} - ${this.price} VND`;

};


// static

bookSchema.statics.findByLanguage=function(language){

    return this.find({
        language:language
    });

};


// virtual

bookSchema.virtual("discountPrice")
.get(function(){

    return this.price * 0.9;

});




const Book = mongoose.model("Book", bookSchema);


export default Book;