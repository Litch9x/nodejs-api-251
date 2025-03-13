const jwt = require("jsonwebtoken");
const config = require("config");
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
        jwt.verify(
            accessToken,
            config.get("app.jwtAccessKey"),
            (error, decode) => {
                if (error) {
                    return res.status(401).json({
                        status: "error",
                        message: "Unauthorized",
                    }
                    );
                };
                next();
            })


    } catch (error) {
        res.status(500).json(error);
    }
}