import express from 'express'
import { validateRequest } from 'zod-express-middleware';
import { aboutSchema } from '../libs/validate-schema.js';
import { createAbout, updateAbout, getAbout } from '../controllers/about.controller.js';


const router = express.Router();

router.post("/", validateRequest({body: aboutSchema}), createAbout )
router.get("/", getAbout)
router.put("/:id", validateRequest({body: aboutSchema}), updateAbout )

export default router