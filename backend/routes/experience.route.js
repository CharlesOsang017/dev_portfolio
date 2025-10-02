import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateRequest } from "zod-express-middleware";
import { experienceSchema } from "../libs/validate-schema.js";
import {
  createExperience,
  allExperience,
  deleteExperience,
  updateExperience
} from "../controllers/experience.controller.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: experienceSchema }),
  createExperience
);
router.get("/", allExperience);
router.delete(
  "/:id",
  authMiddleware,
  validateRequest({ params: z.object({ id: z.string() }) }),
  deleteExperience
);
router.put(
  "/:id",
  authMiddleware,
  validateRequest({
    params: z.object({ id: z.string() }),
    body: experienceSchema,
  }),
  updateExperience
);
export default router;
