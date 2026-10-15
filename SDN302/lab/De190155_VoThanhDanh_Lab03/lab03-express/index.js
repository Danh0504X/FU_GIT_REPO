import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import apiKey from './middleware/apiKey.js';
import logger from './middleware/logger.js';
import bookRouter from './routes/bookRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/books', apiKey, bookRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to BookNest Online Bookstore'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime()
    });
});

app.get('/error', (req, res, next) => {
    try {
        throw new Error('Something went wrong');
    } catch (err) {
        next(err);
    }
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});


app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
