const allowedRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userRole = req.user.usertype?.toLowerCase();

      const hasPermission = roles
        .map((role) => role.toLowerCase())
        .includes(userRole);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

module.exports = allowedRoles;