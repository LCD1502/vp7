/* eslint-disable */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env',
});
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;
let token;

chai.use(chaiHttp);

console.log(`----------------Our environment:  ${process.env.NODE_ENV} ----------------`);

before(async () => {
    const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
    // console.log(DB);
    try {
        await mongoose.connect(DB).then(() => {
            console.log('DB is connected');
        });
    } catch (err) {
        console.error('DB IS NOT CONNECTED\n', err);
    }
});

describe('----------Home Page----------', () => {
    it('Get home page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('----------Login As Admin -> Test Car API----------', () => {
    it('Login', (done) => {
        chai.request(server)
            .post('/api/v1/user/logIn')
            .send({
                email: 'lcd8@gmail.com',
                password: '12345678',
            })
            .end(async (err, res) => {
                await res.should.have.status(200);
                await res.body.should.have.property('token');
                console.log(res.body);
                token = res.body.token;
                console.log(`token: ${token}`);
                done();
            });
    });
    it('Post a Car', (done) => {
        const newCar = {
            specification: {
                displacement: 600,
                power: 200,
                maxSpeed: 235,
                acceleration: 2.1,
                weight: 1500,
            },
            name: 'Testing Car',
            code: 'TestingCar',
            price: 3600000000,
            deposit: 50000000,
            image: '123456qwet',
            amount: 100,
            description: 'this is description for test car',
            model: 'Hijeep',
            warrantyPeriod: 2,
            year: 2006,
            color: ['yellow', 'red'],
            special: 'max speed very fast',
        };
        console.log(`token: ${token}`);

        // console.log(newCar);
        chai.request(server)
            .post('/api/v1/car')
            .set('headers', {
                authorization: 'Bearer ' + token,
            })
            .send(newCar)
            .end((err, res) => {
                console.log(err);
                res.should.have.status(201);
                res.body.should.be.a('object');
                console.log(err);
                done();
            });
    });
});

describe('----------Cars API----------', () => {
    // beforeEach('execute before every test case', function () {
    //     //execute before every test case
    //     console.log('before Car API');
    // });

    // afterEach('executes after every test case', () => {
    //     //executes after each and every test case
    //     console.log('after Car API');
    // });

    it('Get All Cars - 200 - object', (done) => {
        chai.request(server)
            .get('/api/v1/car')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    // it('Post a Car', (done) => {
    //     const newCar = {
    //         specification: {
    //             displacement: 600,
    //             power: 200,
    //             maxSpeed: 235,
    //             acceleration: 2.1,
    //             weight: 1500,
    //         },
    //         name: 'Testing Car',
    //         code: 'TestingCar',
    //         price: 3600000000,
    //         deposit: 50000000,
    //         image: '123456qwet',
    //         amount: 100,
    //         description: 'this is description for test car',
    //         model: 'Hijeep',
    //         warrantyPeriod: 2,
    //         year: 2006,
    //         color: ['yellow', 'red'],
    //         special: 'max speed very fast',
    //     };
    //     // console.log(newCar);
    //     chai.request(server)
    //         .post('/api/v1/car')
    //         .set('headers', {
    //             authorization: 'Bearer ' + token,
    //         })
    //         .send(newCar)
    //         .end((err, res) => {
    //             console.log(err);
    //             res.should.have.status(201);
    //             res.body.should.be.a('object');
    //             console.log(err);
    //             done();
    //         });
    // });
});
