import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Book, { validateBook } from '../../models/Book';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // check if search url parameter is set and if so, filter books by search term by title, author or genre
    const search = req.query.search;

    var books;

    if (search) {
      console.log('searching for: ' + search);
      books = await Book.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } },
        ]
      }).sort({ createdAt: 'desc' });
    } else {
      books = await Book.find().sort({ createdAt: 'desc' });
    }

    // console.log(books);

    res.json({
      books: books.map((m) => {
        return m.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'No book found.' });
    res.json({ book: book.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).json({ message: error.details[0].book });

  try {
    let book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      genre: req.body.genre,
      stock: req.body.stock,
    });
    book = await book.execPopulate();

    res.status(200).json({ book: book.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempBook = await Book.findById(req.params.id);
    if (!(req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You have no permission to do that.' });

    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) return res.status(404).json({ message: 'No book found.' });
    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).json({ message: error.details[0].book });

  try {
    const tempBook = await Book.findById(req.params.id);
    if (!(req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You have no permission to do that.' });

    let book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre,
        stock: req.body.stock,
      },
      { new: true },
    );
    if (!book) return res.status(404).json({ message: 'No book found.' });
    book = await book.execPopulate();

    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
