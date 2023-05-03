var express = require("express");
var Router = express.Router();
const order = require('../models/cartOrder');

// Add food item
Router.post('/', async (req, res) => {
    let data = req.body
    console.log("Cart DAtsasas -> : ", data)
    try {
        const Order = req.body;
        console.log(Order);
        const newOrder = new order({
        foodItem: Order.foodItem,
        VendorID: Order.VendorID,
        BuyerID: Order.BuyerID,
        VendorName: Order.VendorName,
        buyerAge: Order.buyerAge,
        buyerBatch: Order.buyerBatch,
        Quantity: Order.Quantity,
        AddOns: Order.AddOns,
        Veg: Order.Veg,
        Total: Order.Total,
        Rating: Order.Rating,
        date: Order.date,
        Status: Order.Status 
    });
        newOrder
        .save()
        .then(order => {
            console.log(order);
            res.status(200).json(order);
        })
        .catch(err => {console.log("Logged: ", err); res.status(500).json(err); });
    }
    catch (error) {
        console.log(error.message);
        res.send("Server Error")
    }
})

module.exports = Router