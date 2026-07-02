const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const verifyJwt = require("../middlewares/verifyJwt");
const allowedRoles = require("../middlewares/allowedRoles");

router.post(
  "/",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.createUser,
);
router.get(
  "/",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.getUsers,
);
router.get(
  "/:id",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.getUserById,
);
router.get(
  "/admin/:id",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.getUserByadminId,
);
router.get(
  "/super-admin/admins/:id",
  verifyJwt,
  allowedRoles("superadmin"),
  controller.getAdminsBySuperAdminId,
);
router.get(
  "/result/admin/:id",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.getResultUserByadminId,
);
router.put(
  "/:id",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.updateUser,
);
router.delete(
  "/:id",
  verifyJwt,
  allowedRoles("admin", "superadmin"),
  controller.deleteUser,
);
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
