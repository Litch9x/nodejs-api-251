const jwt = require("jsonwebtoken");
const config = require("config");
const { redisClient } = require("../../common/init.redis");
exports.verifyAuthenticationCustomer = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            })
        }
        const accessToken = authorization.split(" ")[1];
        const dirtyToken = await redisClient.get(accessToken);
        if (dirtyToken) {
            return res.status(401).json({
                status: "error",
                message: "Token expired",
            });
        }
        jwt.verify(
            accessToken,
            config.get("app.jwtAccessKey"),
            (error, decode) => {
                if (error) {
                    if (error.name === "TokenExpiredError") {
                        return res.status(401).json({
                            status: "error",
                            message: "Token Expired",
                        });
                    }
                    if (error.name === "JsonWebTokenError") {
                        return res.status(401).json({
                            status: "error",
                            message: "Unauthorized",
                        });
                    }

                };
                req.accessToken = accessToken;
                next();
            })


    } catch (error) {
        res.status(500).json(error);
    }
}