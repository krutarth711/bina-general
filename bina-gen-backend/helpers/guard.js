const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthorized = () => async (req, res, next) => {
    let token = null;
    if(req.headers.authorization){
        token = req.headers.authorization.replace("Bearer", "").trim();
    }

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};


module.exports = {
    isAuthorized
};