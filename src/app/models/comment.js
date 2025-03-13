const mongoose = require("../../common/init.mongo")();
const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        product_id: {
            type: String,
            ref: "Products",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const CommentModel = mongoose.model("Comments", commentSchema, "comments")
module.exports = CommentModel;