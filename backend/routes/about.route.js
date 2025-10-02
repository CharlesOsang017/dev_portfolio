import express from 'express'
import { validateRequest } from 'zod-express-middleware';
import { aboutSchema } from '../libs/validate-schema.js';
import { createAbout } from '../controllers/about.controller.js';

const router = express.Router();

router.post("/", validateRequest({body: aboutSchema}), createAbout )

export default router