import { Router } from 'express';
import usersRoutes from './users';
import booksRoutes from './books';
import withdrawalsRoutes from './withdrawals';
const router = Router();

router.use('/users', usersRoutes);
router.use('/books', booksRoutes);
router.use('/withdrawals', withdrawalsRoutes);

export default router;
