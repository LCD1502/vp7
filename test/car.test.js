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
    try {
        await mongoose.connect(DB).then(() => {
            console.log('<<--Database is connected-->>');
        });
    } catch (err) {
        console.error('DB IS NOT CONNECTED\n', err);
    }
});

describe('---------Login Before Testing Car API----------', () => {
    it('Login', (done) => {
        chai.request(server)
            .post('/api/v1/user/logIn')
            .send({
                email: 'lcdtesthi@gmail.com',
                password: '12345678',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                token = res.body.token;
                // console.log(`token after login: ${token}`);
                done();
            });
    });
});

describe('----------Cars API----------', () => {
    let carId;
    it('Get All Cars', (done) => {
        chai.request(server)
            .get('/api/v1/car')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
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
            code: 'chai-testing',
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
        chai.request(server)
            .post('/api/v1/car')
            .set('Authorization', `Bearer ${token}`)
            .send(newCar)
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(201);
                res.body.should.be.a('object');
                carId = res.body.data._id;
                // console.log(carId);
                done();
            });
    });

    it('Get Car By Id', (done) => {
        chai.request(server)
            .get(`/api/v1/car/${carId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Update Car By Id', (done) => {
        chai.request(server)
            .put(`/api/v1/car/${carId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'this is new description for test car' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.description.should.equal('this is new description for test car');
                done();
            });
    });

    it('Delete Car By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/car/${carId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                done();
            });
    });
});
