const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    let token = null;

    // 1. Authorization Header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3. Custom Header (optional)
    if (!token && req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated User",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }

  res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyJwt;
