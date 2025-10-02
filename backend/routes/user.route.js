import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  loginAdminSchema,
  registerAdminSchema,
} from "../libs/validate-schema.js";
import { createAdminUser, loginAdminUser } from "../controllers/user.controller.js";

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

export default router;
