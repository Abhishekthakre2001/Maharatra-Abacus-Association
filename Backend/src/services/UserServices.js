const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const UserService = {
  createUser: async (data) => {
    // data.password = await bcrypt.hash(data.password, 10);
    return UserModel.create(data);
  },

  getUsers: () => UserModel.findAll(),

  getUserById: (id) => UserModel.findById(id),

  getUserByadminId: (id) => UserModel.findByadminId(id),

   getResultUserByadminId: (id) => UserModel.ResultfindByadminId(id),

  updateUser: (id, data) => UserModel.update(id, data),

  deleteUser: (id) => UserModel.remove(id),

  loginUser: async (username, password) => {
    const user = await UserModel.findByUsername(username);
    if (!user) return null;

    // ✅ PLAIN TEXT comparison
    if (password !== user.password) {
      return null;
    }

    return user;
  }


};

module.exports = UserService;
