import mongoose from "mongoose";
import Book from "../models/Book.js";


// GET ALL BOOKS
export async function getAllBooks(req, res, next) {

    try {

        const books = await Book
            .find({})
            .select("title price quantity category tags")
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("author")
            .populate("category");


        res.status(200).json(books);

    }  catch(error){

        next(error);
    }
}

// GET BOOK BY ID
export async function getBookById(req,res, next){

    try {
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){

            return res.status(400).json({
                message:"Invalid book id"
            });
        }

        const book = await Book.findById(id).populate("author")
            .populate("category");;

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }
        res.status(200).json(book);

    } catch(error){

        next(error);
}

}

// CREATE BOOK
export async function createBook(req,res, next){
    try {

        const book = await Book.create(req.body);

        res.status(201).json({
            message:"Book created successfully",
            data:book
        });

    }  catch(error){

        next(error);
    }
}

// UPDATE BOOK
export async function updateBook(req,res, next){

    try {
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid book id"
            });
        }
        const book = await Book.findByIdAndUpdate(

            id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        );

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.status(200).json({
            message:"Book updated successfully",
            data:book
        });

    } catch(error){

        next(error);

    }

}

// DELETE BOOK
export async function deleteBook(req,res, next){

    try {

        const id=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid book id"
            });
        }

        const book = await Book.findByIdAndDelete(id);

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.status(200).json({
            message:"Book deleted successfully"
        });

    } catch(error){

        next(error);
    }
}