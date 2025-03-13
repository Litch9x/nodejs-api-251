const mongoose = require("../../common/init.mongo")();
const productSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: "Categories",
            required: true,
        },
        name: {
            type: String,
            required: true,
            text: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            required: true,
        },
        accessories: {
            type: String,
            required: true,
        },
        promotion: {
            type: String,
            required: true,
        },
        detail: {
            type: String,
            required: true,
        },
        is_stock: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const ProductModel = mongoose.model("Products", productSchema, "products")
module.exports = ProductModel;