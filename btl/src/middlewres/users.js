const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Lấy token từ tiêu đề yêu cầu
    const token = req.headers.authorization;

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        return res.status(401).json({ message: 'Bạn cần phải đăng nhập để truy cập trang này.' });
    }

    // Xác thực và giải mã token
    jwt.verify(token, '1', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
        // Gắn thông tin người dùng vào yêu cầu để sử dụng trong các xử lý tiếp theo
        req.user = user;
        next(); // Chuyển sang middleware hoặc route tiếp theo
    });
};

module.exports = authenticateToken;
