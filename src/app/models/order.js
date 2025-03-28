const customer = require("../controllers/apis/site/customer");

const mongoose = require("../../common/init.mongo")();
const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Customers",
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {   // shipping, delivered, cancelled
        type: String,
        default: "shipping",
    },
    items:
        [{
            prd_id: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },

        }],


});

const OrderModel = mongoose.model("Orders", orderSchema, "orders")
module.exports = OrderModel;