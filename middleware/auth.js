const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res, next) => {
    if (req.url == "/api/user/login" || req.url == "/" || req.url == "/api-docs") {
        return next()
    }

    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ success: false, msg: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ success: false, msg: "Invalid Token" });
    }

    return next();
};

module.exports = verifyToken;