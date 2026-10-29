import Laptop from "../models/laptopModel.js";


export async function getLaptops(req, res) {

    try {

        const laptops = await Laptop.find();
        res.status(200).json(laptops);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
}


export async function createLaptop(req, res) {

    try {

        const laptop = await Laptop.create(req.body);

        res.status(201).json({
            message: "Laptop added successfully",
            data: laptop
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: error.message
        });

    }
}
