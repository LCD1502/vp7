const express = require('express');
const morgan = require('morgan');
var cors = require('cors');

const app = express();
const rateLimit = require('express-rate-limit'); //limit request from an IP address
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes'); //hiep add carRoutes
const postRoutes = require('./routes/postRoutes'); //hiep add postRoutes
const showRoomRoutes = require('./routes/showRoomRoutes'); //hiep add showRoomRoutes
const accessoryRoutes = require('./routes/accessoryRoutes'); //hiep add accessoryRoutes
const accessoryBillRoutes = require('./routes/accessoryBillRoutes'); //hiep add accessoryRoutes
const carOrderRoutes = require('./routes/carOrderRoutes');
const uploadRouter = require('./routes/cloudiaryRoutes');
const globalErrorHandler = require('./controllers/erorcontroller');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.all('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

// Set Security HTTP headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
            imgSrc: ["'self'", 'data:', 'blob:'],
        },
    })
);

// limit request come from an IP address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Please try again in an hour',
});

app.use('/api', limiter);

//Body parse, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// for example: client dont send email, but they send { "$gt": "" }, its ALWAYS TRUE, so they can login with no email
// now we use express-mongo-sanitize, but we can use SANITIZE-HTML
app.use(mongoSanitize());

//Data sanitization against XSS
// it trans html code to another characters
app.use(xssClean());

// Prevent parameter pollution
// app.use(
//     hpp()
// );

app.get('/', (req, res) => {
    res.send('Seven Group');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/car', carRoutes); // hiep add car
app.use('/api/v1/post', postRoutes); // hiep add post
app.use('/api/v1/showRoom', showRoomRoutes); // hiep add showRoom
app.use('/api/v1/accessory', accessoryRoutes); // hiep add accessory
app.use('/api/v1/accessory-bill', accessoryBillRoutes); // hiep add accessory bill
app.use('/api/v1/carOrder', carOrderRoutes); // Luong
//Lương chỉnh sửa sự nhất quán của biến, route trong các API
app.use('/api/v1/uploads', uploadRouter); // hiep add cloudiary
app.use('*', (req, res, next) => {
    res.status(404).send('Not Found');
});

app.use(globalErrorHandler);

module.exports = app;
