// File: verifyUser.js
import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: false, Error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: false, Error: "Unauthorized: Invalid token" });
        }
        req.id = decoded.id;
        req.email = decoded.email;
        next();
    });
};

