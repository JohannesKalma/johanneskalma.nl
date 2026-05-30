import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3335;

// Recreating __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the templating engine and explicitly point to the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// MIDDLEWARE: HTTP Request Logger
app.use(morgan('dev'));

/*
// -----------------------------------------
// DATA PROCESSING FUNCTIONS (from wp-filters.js)
// -----------------------------------------

const tagRouter = './routes/tagRouter.js';

app.use('/tag','tagRouter') //:slug
app.use('/topics','topicsRouter') //:slug -- categories

*/
import frontpageRouter from './routes/frontpageRouter.js';
import singlePostRouter from './routes/singlePostRouter.js';

app.use('/page',frontpageRouter);
app.get('/',frontpageRouter);
app.use('/:slug',singlePostRouter);

// -----------------------------------------
// ERROR HANDLING MIDDLEWARE
// -----------------------------------------

// Catch 404
app.use((req, res, next) => {
    next(createError(404, `The pathway '${req.originalUrl}' was not found.`));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] Status: ${err.status || 500} - ${err.message}`);

    const statusCode = err.status || 500;
    res.status(statusCode);

    if (statusCode === 404) {
        res.render('404', { url: req.originalUrl, message: err.message });
    } else {
        res.render('500', {
            message: err.message || "An internal server error occurred.",
            error: app.get('env') === 'development' ? err : {}
        });
    }
});

// Add a global helper function for all EJS templates
app.locals.formatPostDate = (dateString) => {
    // 1. Guard clause: Check if dateString is missing or not a string
    if (!dateString || typeof dateString !== 'string') {
        return 'Unknown Date';
    }

    // 2. Regex to validate the exact format: YYYY-MM-DD HH:mm:ss
    // Matches: 4 digits, dash, 2 digits, dash, 2 digits, space, 2 digits, colon, 2 digits, colon, 2 digits
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    if (!dateRegex.test(dateString)) {
        return 'Invalid Date Format';
    }

    const dateObj = new Date(dateString.replace(' ', 'T'));

    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(dateObj);
    const hash = Object.fromEntries(parts.map(p => [p.type, p.value]));

    return `${hash.day} ${hash.month} ${hash.year} at ${hash.hour}:${hash.minute}`;
};

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});