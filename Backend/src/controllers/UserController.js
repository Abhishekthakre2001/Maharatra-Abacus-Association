const UserService = require("../services/UserServices");

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

exports.updateUser = async (req, res) => {
  await UserService.updateUser(req.params.id, req.body);
  res.json({ success: true });
};

exports.deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.json({ success: true });
};
