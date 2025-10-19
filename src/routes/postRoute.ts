import Router from "express";
import { PostController } from "../controllers/postController";

const router =  Router();


router.get('/', PostController.getAllPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getSinglePost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);


export default router;