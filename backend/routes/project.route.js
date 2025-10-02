import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateRequest } from "zod-express-middleware";
import { createNewProject, getProjects, deleteProject, updateProject } from "../controllers/project.controller.js";
import { projectSchema } from "../libs/validate-schema.js";
import {z} from 'zod'

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: projectSchema }),
  createNewProject
);

router.get("/", getProjects)
router.delete(
  "/:id",
  authMiddleware,
  validateRequest({ params: z.object({ id: z.string() }) }),
  deleteProject
)
router.put(
  "/:id",
  authMiddleware,
  validateRequest({ params: z.object({ id: z.string() }), body: projectSchema }),
  updateProject
)
export default router;
