const express = require('express');
const morgan = require('morgan');
var cors = require("cors");

const app = express();
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


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

app.get('/', (req, res) => {
    res.send('Hello World Dung qua ngu theem cdn 2.0');
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
