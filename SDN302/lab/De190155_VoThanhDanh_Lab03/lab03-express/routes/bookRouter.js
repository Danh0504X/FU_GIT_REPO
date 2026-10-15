import express from 'express';
import validateBook from '../middleware/validateBook.js';

const router = express.Router();

let books = [
    {
        id: 1,
        title: 'NodeJS Basic',
        price: 20,
        category: 'Programming'
    }
];

router.get('/', (req, res) => {
    res.json(books);
});

router.get('/:id', (req, res) => {
    const book = findBook(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});

router.post('/', validateBook, (req, res) => {
    const newBook = { id: getNextId(), ...req.body };
    books.push(newBook);
    res.status(201).json(newBook);
});

router.put('/:id', validateBook, (req, res) => {
    const book = findBook(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    Object.assign(book, req.body);
    res.json(book);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!books.some(book => book.id === id)) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books = books.filter(book => book.id !== id);
    res.json({ message: 'Book deleted' });
});

function findBook(id) {
    return books.find(book => book.id === Number(id));
}

function getNextId() {
    return books.length === 0
        ? 1
        : Math.max(...books.map(book => book.id)) + 1;
}

export default router;
