import express from 'express';
import * as tutorialController from "../controllers/tutorialController.js";
const router = express.Router();

router.post("/tutorial", tutorialController.upload, tutorialController.uploadTutorial);
router.get("/alltutorials", tutorialController.getAllTutorials);
router.get("/tutorial/:id", tutorialController.getTutorialId);

export default router;
