import express from "express";
import {
  getMyLibrary,
  listVideos,
  toggleLike,
  toggleSave,
  toggleSubscribe
} from "../../controllers/videoController.js";
import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", listVideos);
router.get("/library", requireAuth, getMyLibrary);
router.post("/like", requireAuth, toggleLike);
router.post("/save", requireAuth, toggleSave);
router.post("/subscribe", requireAuth, toggleSubscribe);

export default router;
