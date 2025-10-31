import Router from "express";
import { PostController } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router =  Router();


router.get('/', PostController.getAllPosts);
router.get('/search', PostController.searchPosts);
router.post('/', authMiddleware, authorizeRoles('user'), PostController.createPost);
router.get('/:id', PostController.getSinglePost);
router.put('/:id', authMiddleware, authorizeRoles('user'), PostController.updatePost);
router.delete('/:id', authMiddleware, authorizeRoles('user'), PostController.deletePost);


export default router;