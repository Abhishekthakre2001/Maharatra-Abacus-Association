const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const UserService = {
  createUser: async (data) => {
    data.password = await bcrypt.hash(data.password, 10);
    return UserModel.create(data);
  },

  getUsers: () => UserModel.findAll(),

  getUserById: (id) => UserModel.findById(id),

  updateUser: (id, data) => UserModel.update(id, data),

  deleteUser: (id) => UserModel.remove(id)
};

module.exports = UserService;
