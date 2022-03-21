const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env',
});

const app = require('./app');

console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// console.log(DB);
mongoose
    .connect(DB)
    .then(() => {
        console.log('DB is connected');
    })
    .catch((err) => console.error('DB IS NOT CONNECTED\n', err));

const port = process.env.PORT || 3000; // show all env variables

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    // console.log(`Example app listening on port 3000`)
});
