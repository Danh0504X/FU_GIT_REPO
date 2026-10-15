/**
 * SDN302 - Demo Slot 3.3: the Express API of Demo 03, now backed by MongoDB.
 * The in-memory array is gone: every route hits the real database.
 */
require('dotenv').config();
const express = require('express');
const { connectDB, closeDB } = require('./db');
const repo = require('./bookRepository');

const app = express();
app.use(express.json());

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/books', wrap(async (req, res) => {
  res.json({ success: true, ...(await repo.getAllBooks(req.query)) });
}));

app.get('/api/books/stats', wrap(async (req, res) => {
  res.json({ success: true, data: await repo.statsByCategory() });
}));

app.get('/api/books/:id', wrap(async (req, res) => {
  const book = await repo.getBookById(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, data: book });
}));

app.get('/api/books/:id/full', wrap(async (req, res) => {
  const book = await repo.getBookWithRelations(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, data: book });
}));

app.post('/api/books', wrap(async (req, res) => {
  const { title, price } = req.body;
  if (!title || typeof price !== 'number')
    return res.status(400).json({ success: false, message: 'title and numeric price are required' });
  res.status(201).json({ success: true, data: await repo.createBook(req.body) });
}));

app.put('/api/books/:id', wrap(async (req, res) => {
  const book = await repo.updateBook(req.params.id, req.body);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, data: book });
}));

app.delete('/api/books/:id', wrap(async (req, res) => {
  const book = await repo.deleteBook(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, message: 'Deleted', data: book });
}));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`)))
  .catch((err) => { console.error('Cannot connect to MongoDB:', err.message); process.exit(1); });

process.on('SIGINT', async () => { await closeDB(); process.exit(0); });
