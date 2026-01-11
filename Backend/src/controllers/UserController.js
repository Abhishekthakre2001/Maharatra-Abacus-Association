const UserService = require("../services/UserServices");
const jwt = require("jsonwebtoken");

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

exports.getUserByadminId = async (req, res) => {
  const user = await UserService.getUserByadminId(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  await UserService.updateUser(req.params.id, req.body);
  res.json({ success: true });
};

exports.deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.json({ success: true });
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }

    const user = await UserService.loginUser(username, password);

    console.log("user", user)

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    if (user.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive or locked"
      });
    }


    // ⏳ Subscription expiry check
    if (user.subscription_end_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize today

      const expiryDate = new Date(user.subscription_end_date);
      expiryDate.setHours(0, 0, 0, 0); // normalize expiry

      if (expiryDate < today) {
        return res.status(403).json({
          success: false,
          message: "Subscription expired. Please contact admin."
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, usertype: user.usertype },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    delete user.password;

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
