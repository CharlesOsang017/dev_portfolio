import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  loginAdminSchema,
  registerAdminSchema,
} from "../libs/validate-schema.js";
import {
  createAdminUser,
  loginAdminUser,
  getLoggedInAdmin,
  logoutAdminUser,
} from "../controllers/user.controller.js";
// import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({ body: registerAdminSchema }),
  createAdminUser
);

router.post(
  "/login",
  validateRequest({ body: loginAdminSchema }),
  loginAdminUser
);

router.get("/me",  getLoggedInAdmin);
router.post("/logout", logoutAdminUser);

export default router;
