const ProductModel = require("../../../models/product")
const CommentModel = require("../../../models/comment")
const pagination = require("../../../../libs/pagination")
module.exports = {
    index: async (req, res) => {

        try {
            const query = {};
            const page = req.query.page || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = page * limit - limit;
            if (req.query.is_featured) query.is_featured = req.query.is_featured;
            if (req.query.is_stock) query.is_featured = req.query.is_stock;
            if (req.query.name) query.$text = { $search: req.query.name };

            const products = await ProductModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
            res.status(200).json({
                status: "success",
                filters: {
                    is_featured: req.query.is_featured || null,
                    is_stock: req.query.is_stock || null,
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
    },
    show: async (req, res) => {
        try {
            const { id } = req.params; 
            const product = await ProductModel.findById(id);
            res.status(200).json({
                status: "success",
                data: product,
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    comments: async (req, res) => {
        try {
            const { id } = req.params;
            const query = {};
            query.product_id = id;
            const page = req.query.page || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = page * limit - limit;
            const comments = await CommentModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);



            res.status(200).json({
                status: "success",
                filters: {
                    product_id: id,
                    page,
                    limit,
                },
                data: {
                    docs: comments,
                    pages: await pagination(CommentModel, query, limit, page),
                },
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    storeComment: async (req, res) => {
        try {
            const { id } = req.params;
            const comment = req.body;
            comment.product_id = id;
            await new CommentModel(comment).save();

            res.status(200).json({
                status: "success",
                data: comment,
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

}



