import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Withdrawal, { validateWithdrawal } from '../../models/Withdrawal';
import Book from '../../models/Book';
import User from '../../models/User';

const router = Router();

// obtain a list of users and populate with withdrawal history
router.get('/', requireJwtAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });

    // populate each user with their withdrawal history
    const populatedUsers = await Promise.all(users.map(async (user) => {
      const withdrawals = await Withdrawal.find({ user: user._id, returned: false }).sort({ createdAt: 'desc' });
      
      // populate each withdrawal with the book it was for
      const populatedWithdrawals = await Promise.all(withdrawals.map(async (withdrawal) => {
        // skip if withdrawal is returned
        const book = await Book.findById(withdrawal.book);
        return { ...withdrawal.toJSON(), book: book.toJSON() };
      }));

      return { ...user.toJSON(), populatedWithdrawals };
    }));

    res.json({
      users: populatedUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateWithdrawal(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {

    let tempBook = await Book.findById(req.body.book);
    if (!tempBook) return res.status(400).json({ message: 'No book found.' });
    if (tempBook.stock < req.body.quantity) return res.status(400).json({ message: 'Not enough stock.' });
    
    tempBook.stock -= req.body.quantity;
    await tempBook.save();

    let withdrawal = await Withdrawal.create({
      book: req.body.book,
      user: req.user.id,
      quantity: req.body.quantity,
    });

    withdrawal = await withdrawal.execPopulate();

    console.log(withdrawal);

    withdrawal = await withdrawal.populate('book').execPopulate();

    res.status(200).json({ book: withdrawal.book.toJSON() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong.', error: err });
  }
});

// endpoint to put back a book to stock, setting "returned" to true
router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    let withdrawal = await Withdrawal.findById(req.params.
    id);
    if (!withdrawal) return res.status(400).json({ message: 'No withdrawal found.' });
    if (withdrawal.returned) return res.status(400).json({ message: 'Book already returned.' });
    
    const tempBook = await Book.findById(withdrawal.book);
    if (!tempBook) return res.status(400).json({ message: 'No book found.' });
    tempBook.stock += withdrawal.quantity;
    await tempBook.save();

    withdrawal.returned = true;
    await withdrawal.save();

    withdrawal = await withdrawal.execPopulate();

    // find user and populate with withdrawal history
    const user = await User.findById(withdrawal.user);
    
    // populate user with withdrawal history and each withdrawal with the book it was for
    const withdrawals = await Withdrawal.find({ user: user._id, returned: false }).sort({ createdAt: 'desc' });
      
      // populate each withdrawal with the book it was for
      const populatedWithdrawals = await Promise.all(withdrawals.map(async (withdrawal) => {
        // skip if withdrawal is returned
        const book = await Book.findById(withdrawal.book);
        return { ...withdrawal.toJSON(), book: book.toJSON() };
      }));
    
    let populatedUser = { ...user.toJSON(), populatedWithdrawals };
    
    res.status(200).json({ userWithdrawal: populatedUser });


  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong.', error: err });
  }
});

export default router;
