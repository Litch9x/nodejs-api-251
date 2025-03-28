const CustomerModel = require('../../models/customer');
const TokenModel = require('../../models/token');
const jwt = require('jsonwebtoken');
const config = require("config");
const { jwtDecode } = require("jwt-decode");
const { redisClient } = require("../../../common/init.redis");

const generateAccessToken = async (customer) => {
    return jwt.sign(
        {
            email: customer.email,
        },
        config.get("app.jwtAccessKey"),
        { expiresIn: "1h" }
    );
}
const generateRefreshToken = async (customer) => {
    return jwt.sign(
        {
            email: customer.email,
        },
        config.get("app.jwtRefreshKey"),
        { expiresIn: "1h" }
    );
}

const setTokenBlackList = async (token) => {
    const decoded = jwtDecode(token);
    if (decoded.exp > Date.now() / 1000) {
        //move to redis
        redisClient.set(token, "blacklist", {
            EXAT: decoded.exp
        });
    }
};
//move to redis 
exports.registerCustomer =
    async (req, res) => {
        try {
            const { email, password, phone, fullName, address } = req.body;
            const isEmail = await CustomerModel.findOne({ email });
            if (isEmail) {
                return res.status(400).json({ status: "error", message: "Email is already exist" });
            }
            const isPhone = await CustomerModel.findOne({ phone });
            if (isPhone) {
                return res.status(400).json({ status: "error", message: "Phone is already exist" });
            }
            const newCustomer = new CustomerModel({
                email,
                password,
                phone,
                fullName,
                address
            });
            await newCustomer.save();
            return res.status(201).json({ status: "success", message: "Register successfully" });
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

                const { password, ...customer } = isEmail._doc;
                const accessToken = await generateAccessToken(customer);
                const refreshToken = await generateRefreshToken(customer);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true, //just server can access  
                });

                const isToken = await TokenModel.findOne({ customer_id: isEmail._id });
                if (isToken) {
                    //move to redis
                    setTokenBlackList(isToken.accessToken);
                    setTokenBlackList(isToken.refreshToken);
                    //delete old token
                    await TokenModel.deleteOne({ customer_id: isEmail._id });
                }
                const newToken = new TokenModel({
                    customer_id: isEmail._id,
                    accessToken,
                    refreshToken
                });
                await newToken.save();

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
exports.logoutCustomer = async (req, res) => {
    try {
        // Mark access token & refresh token as dirty tokens
        const { accessToken } = req;
        const token =await TokenModel.findOne({ accessToken });
        //move to redis
        setTokenBlackList(token.accessToken);
        setTokenBlackList(token.refreshToken);
        //delete old token
        await TokenModel.deleteOne({ accessToken });
        return res.status(200).json("logged out  successfully");
    }

    catch (error) {
        return res.status(500).json(error);
    }
};


exports.refreshToken =
    async (req, res) => {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({ status: "error", message: "Authentication is required" });
            }
            const dirtyToken = await redisClient.get(refreshToken);
            if (dirtyToken) {
                return res.status(401).json({
                    status: "error",
                    message: "Token expired"
                });
            }
            jwt.verify(refreshToken, config.get("app.jwtRefreshKey"), async (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        status: "error",
                        message: "Authentication is required"
                    });
                }
                const newAccessToken = await generateAccessToken(decoded);
                await TokenModel.findOneAndUpdate({ refreshToken }, { accessToken: newAccessToken });
                return res.status(200).json({
                    status: "success",
                    message: "Refresh token successfully",
                    data: {
                        accessToken: newAccessToken,

                    }
                });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    };

