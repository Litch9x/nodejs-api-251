const OrderModel = require("../../../models/order");
const ProductModel = require("../../../models/product");
const transporter = require("../../../../libs/transporter");
const ejs = require("ejs");
const path = require("path");
const CustomerModel = require("../../../models/customer");
const paginate = require("../../../../libs/pagination");
module.exports = {
    order: async (req, res) => {
        try {
            const { items, customer_id, totalPrice } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!customer_id || !items || items.length === 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid order data"
                });
            }

            // Lấy thông tin khách hàng
            const customer = await CustomerModel.findById(customer_id);
            if (!customer) {
                return res.status(400).json({
                    status: "error",
                    message: "Customer not found"
                });
            }

            // Lấy thông tin sản phẩm
            const prdIds = items.map(item => item.prd_id);
            const products = await ProductModel.find({ _id: { $in: prdIds } });

            // Khớp sản phẩm với đơn hàng
            const newItems = items.map(item => {
                const product = products.find(prd => prd._id.toString() === item.prd_id);
                return {
                    ...item,
                    name: product ? product.name : "Unknown Product",
                };
            });

            // Render email template
            let html;
            try {
                html = await ejs.renderFile(
                    path.join(req.app.get("views"), "site", "mail.ejs"),
                    { customer, items: newItems, totalPrice }
                );
            } catch (renderError) {
                return res.status(500).json({
                    status: "error",
                    message: "Email template rendering failed",
                    error: renderError
                });
            }

            // Gửi email xác nhận
            try {
                await transporter.sendMail({
                    from: '"Vietpro Store" <quantri.vietproshop@gmail.com>',
                    to: customer.email,
                    subject: "Xác nhận đơn hàng từ Vietpro Store",
                    html,
                });
            } catch (emailError) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to send confirmation email",
                    error: emailError
                });
            }

            // Lưu đơn hàng vào DB
            const newOrder = new OrderModel({
                customer_id,
                items: newItems,
                totalPrice,
                createdAt: new Date()
            });

            await newOrder.save();

            return res.status(200).json({
                status: "success",
                message: "Order successfully placed",
                data: newOrder
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error
            });
        }
    },

    index: async (req, res) => {
        try {
            const { id } = req.params;
            const query = {};
            query.customer_id = id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const orders = await OrderModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
            return res.status(200).json({
                status: "success",
                docs: orders,
                page: await paginate(OrderModel, query, page, limit),

            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error
            });
        }
    },

    show: async (req, res) => {
        try {
            const { id } = req.params;
            const orderDetail = await OrderModel.findById(id);
            return res.status(200).json({
                status: "success",
                data: orderDetail,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error
            });
        }
    },
    cancelled: async (req, res) => {
        try {
            const { id } = req.params;
            await OrderModel.updateOne({ _id: id }, { status: "cancelled" });
            return res.status(200).json({
                status: "success",
                message: "Order cancelled successfully",

            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error
            });
        }
    },
    delivered: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await OrderModel.findById(id);

            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Order not found"
                });
            }

            await OrderModel.updateOne({ _id: id }, { status: "delivered" });

            return res.status(200).json({
                status: "success",
                message: "Order marked as delivered successfully"
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error
            });
        }
    },

};
