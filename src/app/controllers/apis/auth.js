const CustomerModel = require('../../models/customer');
const jwt = require('jsonwebtoken');
const config = require("config");
exports.registerCustomer =
    async (req, res) => {
        try {

        } catch (error) {
            res.status(500).json(error);

        }
    };
exports.loginCustomer =
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const isEmail = await CustomerModel.findOne({ email });
            if (!isEmail) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is not exist"
                })
            };
            const isPassword = isEmail.password === password;
            if (!isPassword) {
                return res.status(400).json({
                    status: "error",
                    message: "Password is incorrect"
                })
            }
            if (isEmail && isPassword) {
                //generate token
                const accessToken = jwt.sign(
                    {
                        email
                    },
                    config.get("app.jwtAccessKey"),
                    { expiresIn: "1h" }
                );
                const { password, ...customer } = isEmail._doc;
                return res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    data: {
                        accessToken,
                        customer: customer,
                    }
                })
            }
        } catch (error) {
            res.status(500).json(error);

        }
    };
exports.logoutCustomer =
    async (req, res) => {
        try {

        } catch (error) {
            res.status(500).json(error);

        }
    };
