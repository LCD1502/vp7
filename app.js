const express = require('express');
const morgan = require('morgan');

const app = express();
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/erorcontroller');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1/user', userRoutes);

app.use('*', (req, res, next) => {
    res.status(404).send('Not Found');
});

app.use(globalErrorHandler);

module.exports = app;
