const CustomerModel = require('../../../models/customer');

module.exports = {
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { phone, fullName, address } = req.body;

            // Kiểm tra xem số điện thoại đã tồn tại chưa
            const existingCustomer = await CustomerModel.findOne({ phone });
            if (existingCustomer && existingCustomer._id.toString() !== id) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone number already exists"
                });
            }

            // Cập nhật thông tin khách hàng
            const updatedCustomer = await CustomerModel.findByIdAndUpdate(
                id,
                { phone, fullName, address },
                { new: true } // Trả về dữ liệu mới sau cập nhật
            );

            if (!updatedCustomer) {
                return res.status(404).json({
                    status: "error",
                    message: "Customer not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Update successfully",
                data: updatedCustomer
            });
        } catch (error) {
            console.error("Update Error:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error: error.message
            });
        }
    }
};
