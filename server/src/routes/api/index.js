import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import booksRoutes from './books';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/books', booksRoutes);

export default router;
