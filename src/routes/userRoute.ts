import express from 'express';
import { UserController } from '../controllers/userController';


const router = express.Router();

router.get('/:id', UserController.getUserById);

export default router;
