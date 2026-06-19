const UserService = require("../services/UserServices");
const jwt = require("jsonwebtoken");
const { getPaginationParams } = require("../utils/getPaginationParams");

exports.createUser = async (req, res) => {
  const result = await UserService.createUser(req.body);
  res.status(201).json({ success: true, id: result.insertId });
};

exports.getUsers = async (req, res) => {
  const users = await UserService.getUsers();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  res.json(user);
};

// exports.getUserByadminId = async (req, res) => {
//   const user = await UserService.getUserByadminId(req.params.id);
//   res.json(user);
// };

exports.getUserByadminId = async (req, res) => {
  const { page, limit, search } = getPaginationParams(req);

  const result = await UserService.getUserByadminId(
    req.params.id,
    page,
    limit,
    search
  );

  res.json(result);
};
exports.getResultUserByadminId = async (req, res) => {
  const user = await UserService.getResultUserByadminId(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  console.log("req.body", req.body);
  await UserService.updateUser(req.params.id, req.body);
  res.json({ success: true });
};

exports.deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.json({ success: true });
};

// exports.loginUser = async (req, res) => {
//   try {
//     let { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password required"
//       });
//     }

//     // ✅ ONLY trim spaces
//     username = username.trim();

//     const user = await UserService.loginUser(username, password);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid username or password"
//       });
//     }

//     if (user.status !== 1) {
//       return res.status(403).json({
//         success: false,
//         message: "User account is inactive or locked"
//       });
//     }

//     // ⏳ subscription check (unchanged)
//     if (user.subscription_end_date) {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const expiryDate = new Date(user.subscription_end_date);
//       expiryDate.setHours(0, 0, 0, 0);

//       if (expiryDate < today) {
//         return res.status(403).json({
//           success: false,
//           message: "Subscription expired. Please contact admin."
//         });
//       }
//     }

//     const token = jwt.sign(
//       { id: user.id, username: user.username, usertype: user.usertype },
//       process.env.JWT_SECRET || "SECRET_KEY",
//       { expiresIn: "1d" }
//     );

//     delete user.password;

//     res.json({
//       success: true,
//       token,
//       user
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    // ✅ ONLY trim spaces
    username = username.trim();

    const user = await UserService.loginUser(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive or locked",
      });
    }

    // ⏳ subscription check (unchanged)
    if (user.subscription_end_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDate = new Date(user.subscription_end_date);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        return res.status(403).json({
          success: false,
          message: "Subscription expired. Please contact admin.",
        });
      }
    }

    // ==========================
    // ACCESS TOKEN (15 MIN)
    // ==========================
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        usertype: user.usertype,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // ==========================
    // REFRESH TOKEN (30 MIN)
    // ==========================
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "30m",
      },
    );

    const refreshTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

    // save token in DB
    await UserService.saveRefreshToken(
      user.id,
      refreshToken,
      refreshTokenExpiry,
    );

    delete user.password;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production https
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production https
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 min
    });

    res.cookie("refreshTokenExpiry", refreshTokenExpiry.toISOString(), {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "Logged in Successfully",
      accessToken,
      refreshToken,
      refreshTokenExpiry,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify token matches DB
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        usertype: user.usertype,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired",
    });
  }
};
