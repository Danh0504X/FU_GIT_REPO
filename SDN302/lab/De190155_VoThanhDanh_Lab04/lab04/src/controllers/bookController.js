import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

export async function getAllBooks(req, res) {
    try {
        const db = getDB();
        const books = await db
            .collection("books")
            .find({})
            .toArray();
        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get books",
            error: error.message
        });

    }

}

export async function getBookById(req, res) {
    try {
        const db = getDB();
        const id = req.params.id;
        const book = await db
            .collection("books")
            .findOne({
                _id: new ObjectId(id)
            });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json(book);

    } catch (error) {


        res.status(500).json({
            message: "Failed to get book",
            error: error.message
        });
    }
}

export async function createBook(req, res) {
    try {
        const db = getDB();

        const newBook = {
            title: req.body.title,
            price: req.body.price,
            quantity: req.body.quantity,
            publishedYear: req.body.publishedYear,
            category: req.body.category,
            tags: req.body.tags || []
        };

        const result = await db
            .collection("books")
            .insertOne(newBook);

        res.status(201).json({
            message: "Book created successfully",
            insertedId: result.insertedId
        });

    } catch(error) {

        res.status(500).json({
            message:"Failed to create book",
            error:error.message
        });
    }
}

export async function updateBook(req,res){
    try {
        const db=getDB();
        const id=req.params.id;
        const result = await db
            .collection("books")
            .updateOne(
                {
                    _id:new ObjectId(id)
                },
                {
                    $set:req.body
                }
            );

        if(result.matchedCount===0){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.status(200).json({
            message:"Book updated successfully"
        });

    }catch(error){

        res.status(500).json({
            message:"Failed to update book",
            error:error.message

        });
    }
}

export async function deleteBook(req,res){

    try{

        const db=getDB();
        const id=req.params.id;
        const result = await db
            .collection("books")
            .deleteOne({
                _id:new ObjectId(id)
            });

        if(result.deletedCount===0){
            return res.status(404).json({
                message:"Book not found"
            });
        }
        res.status(200).json({
            message:"Book deleted successfully"
        });

    }catch(error){
        res.status(500).json({
            message:"Failed to delete book",
            error:error.message
        });
    }
}

export async function searchBooks(req, res) {

    try {
        const db = getDB();

        const {
            category,
            minPrice,
            maxPrice,
            keyword,
            page = 1,
            limit = 3
        } = req.query;

        let filter = {};

        if(category){
            filter.category = category;
        }

        if(minPrice || maxPrice){
            filter.price = {};
            if(minPrice){
                filter.price.$gte =
                Number(minPrice);
            }
            if(maxPrice){
                filter.price.$lte =
                Number(maxPrice);
            }
        }

        if(keyword){
            filter.title = {
                $regex: keyword,
                $options:"i"
            };
        }

        const skip = (Number(page)-1 )* Number(limit);


        const total =
        await db.collection("books")
        .countDocuments(filter);

        const books =
        await db.collection("books")
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .toArray();

        res.status(200).json({

            total: total,
            page: Number(page),
            data: books
        });

    }
    catch(error){
        res.status(500).json({
            message:"Failed to search books",
            error:error.message
        });
    }
}