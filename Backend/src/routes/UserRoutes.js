const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");

router.post("/", controller.createUser);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.get("/admin/:id", controller.getUserByadminId);
router.get("/result/admin/:id", controller.getResultUserByadminId);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.post("/login", controller.loginUser);

module.exports = router;
