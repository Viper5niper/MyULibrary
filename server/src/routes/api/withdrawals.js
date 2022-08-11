import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Withdrawal, { validateWithdrawal } from '../../models/Withdrawal';

const router = Router();

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateWithdrawal(req.body);
  if (error) return res.status(400).json({ withdrawal: error.details[0].withdrawal });

  try {
    let withdrawal = await Withdrawal.create({
      text: req.body.text,
      user: req.user.id,
    });
    withdrawal = await withdrawal.populate('user').execPopulate();
    withdrawal = await withdrawal.populate('book').execPopulate();

    res.status(200).json({ withdrawal: withdrawal.toJSON() });
  } catch (err) {
    res.status(500).json({ withdrawal: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempWithdrawal = await Withdrawal.findById(req.params.id).populate('user');
    if (!(tempWithdrawal.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ withdrawal: 'Not the withdrawal owner or admin.' });

    const withdrawal = await Withdrawal.findByIdAndRemove(req.params.id).populate('user');
    if (!withdrawal) return res.status(404).json({ withdrawal: 'No withdrawal found.' });
    res.status(200).json({ withdrawal });
  } catch (err) {
    res.status(500).json({ withdrawal: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  const { error } = validateWithdrawal(req.body);
  if (error) return res.status(400).json({ withdrawal: error.details[0].withdrawal });

  try {
    const tempWithdrawal = await Withdrawal.findById(req.params.id).populate('user');
    if (!(tempWithdrawal.user.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ withdrawal: 'Not the withdrawal owner or admin.' });

    let withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, user: tempWithdrawal.user.id },
      { new: true },
    );
    if (!withdrawal) return res.status(404).json({ withdrawal: 'No withdrawal found.' });
    withdrawal = await withdrawal.populate('user').execPopulate();

    res.status(200).json({ withdrawal });
  } catch (err) {
    res.status(500).json({ withdrawal: 'Something went wrong.' });
  }
});

export default router;
