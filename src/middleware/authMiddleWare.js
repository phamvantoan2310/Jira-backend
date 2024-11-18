const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const AuthMiddleWare = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];

    // Kiểm tra xem header có chứa token không
    if (!authHeader) {
        return res.status(401).json({
            status: "ERR",
            message: "Authorization header is missing"
        });
    }
    const token = authHeader.split(" ")[1];  // Tách token ra khỏi chuỗi 'Bearer token'
    // Kiểm tra token có tồn tại không
    if (!token) {
        return res.status(401).json({
            status: "ERR",
            message: "Token is missing"
        });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            if(err.name === 'TokenExpiredError'){
                return res.status(401).json({
                    status: "ERR",
                    message: "token expired",
                    expiredAt: err.expiredAt
                })
            }
            return res.status(403).json({
                status: "ERR",
                message: "Invalid token"
            });
        }

        // Nếu token hợp lệ, tiếp tục xử lý

        if (user && user.id) {
            req.user = user;  // Lưu user vào request để sử dụng trong các middleware khác
            next();  // Tiếp tục xử lý các middleware khác
        } else {
            return res.status(403).json({
                status: "ERR",
                message: "Invalid token payload"
            });
        }
    });
};

module.exports = AuthMiddleWare;



