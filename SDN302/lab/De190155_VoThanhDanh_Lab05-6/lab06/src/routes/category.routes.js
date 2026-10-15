import express from "express";


const router = express.Router();

router.post("/categories", async(req,res)=>{

    try{

        const category = await Category.create(req.body);


        res.status(201).json({
            message:"Category created successfully",
            data:category
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

router.get("/categories", async(req,res)=>{

    try{

        const categories = await Category.find();

        res.json(categories);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


export default router;