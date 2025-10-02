import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createNewSkill,
  allSkills,
  deleteSkill,
  updateSkill
} from "../controllers/skill.controller.js";
import { validateRequest } from "zod-express-middleware/lib/index.js";
import { skillsSchema } from "../libs/validate-schema.js";
import { z } from "zod";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: skillsSchema }),
  createNewSkill
);
router.get("/", allSkills);
router.delete(
  "/:id",
  authMiddleware,
  validateRequest({ params: z.object({ id: z.string() }) }),
  deleteSkill
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest({ params: z.object({ id: z.string() }) }),
  updateSkill
);

export default router;
