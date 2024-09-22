const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "Session expired or user not authenticated. Please log in again."
        });
    }
};

module.exports = isAuth;
