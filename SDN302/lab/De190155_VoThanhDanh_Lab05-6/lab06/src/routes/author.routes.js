import express from "express";


const router = express.Router();

router.post("/authors", async (req,res)=>{

    try{

        const author = await Author.create(req.body);


        res.status(201).json({
            message:"Author created successfully",
            data:author
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

router.get("/authors", async(req,res)=>{

    try{

        const authors = await Author.find();

        res.json(authors);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

export default router;