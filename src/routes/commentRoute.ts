import Router from "express";
import { CommentController } from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("user", "admin"), CommentController.addComment);
router.get("/post/:id", CommentController.getCommentsForPost);
router.put("/:id", authMiddleware, authorizeRoles("user", "admin"), CommentController.updateComment);
router.delete("/:id", authMiddleware, authorizeRoles("user", "admin"), CommentController.deleteComment);

export default router;