const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const verifyJwt = require("../middlewares/verifyJwt");
const allowedRoles = require("../middlewares/allowedRoles");

router.post("/", verifyJwt, allowedRoles("admin"), controller.createUser);
router.get("/", verifyJwt, allowedRoles("admin"), controller.getUsers);
router.get("/:id", verifyJwt, allowedRoles("admin"), controller.getUserById);
router.get(
  "/admin/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.getUserByadminId,
);
router.get(
  "/result/admin/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.getResultUserByadminId,
);
router.put("/:id", verifyJwt, allowedRoles("admin"), controller.updateUser);
router.delete("/:id", verifyJwt, allowedRoles("admin"), controller.deleteUser);
router.post("/login", controller.loginUser);
router.post("/refresh-token", controller.refreshToken);

router.get(
  "/export/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.exportUserByAdminId,
);
router.get(
  "/test-result/export/:id",
  verifyJwt,
  allowedRoles("admin"),
  controller.exportTestResultData,
);
module.exports = router;
