const express = require('express');
const morgan = require('morgan');

const app = express();
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes'); //hiep add carRoutes
const postRoutes = require('./routes/postRoutes'); //hiep add postRoutes
const showRoomRoutes = require('./routes/showRoomRoutes'); //hiep add showRoomRoutes
const accessoryRoutes = require('./routes/accessoryRoutes'); //hiep add accessoryRoutes
const accessoryBillRoutes = require('./routes/accessoryBillRoutes'); //hiep add accessoryRoutes
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
app.use('/api/v1/car', carRoutes); // hiep add car
app.use('/api/v1/post', postRoutes); // hiep add post
app.use('/api/v1/showRoom', showRoomRoutes); // hiep add showRoom
app.use('/api/v1/accessory', accessoryRoutes); // hiep add accessory
app.use('/api/v1/accessory-bill', accessoryBillRoutes); // hiep add accessory bill

app.use('*', (req, res, next) => {
    res.status(404).send('Not Found');
});

app.use(globalErrorHandler);

module.exports = app;
