const jwt = require("jsonwebtoken");
const CONSTANTS = require("../constants")

const verifyToken = (req, res, next) => {

    if(req.url=="/api/user/login"){
        return next()
    }

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, CONSTANTS.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

module.exports = verifyToken;