const CategoryModel = require("../../../models/category");
const ProductModel = require("../../../models/product");
const pagination = require("../../../../libs/pagination")
module.exports = {
    index: async (req, res) => {
        try {
            const categories = await CategoryModel.find().sort({ _id: 1 });
            res.status(200).json({
                status: "success",
                data: categories,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    show: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findById(id);

            res.status(200).json({
                status: "success",
                data: category,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    categoryProducts: async (req, res) => {
        try {
            const { id } = req.params;
            const query = {};
            query.category_id = id;
            const page = req.query.page || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = page * limit - limit;
            const products = await ProductModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
          

            res.status(200).json({
                status: "success",
                filters: {
                    category_id: id,
                    page,
                    limit,
                },
                data: {
                    docs: products,
                    pages: await pagination(ProductModel, query, limit, page),
                },
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

