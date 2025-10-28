import Router from "express";
import { PostController } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router =  Router();


router.get('/', authMiddleware, authorizeRoles('user'), PostController.getAllPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getSinglePost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);


export default router;