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

describe('---------Login Before Testing Car Order API----------', () => {
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

describe('----------Car Order API----------', () => {
    let carOrderId;
    it('User Get Car Order', (done) => {
        chai.request(server)
            .get('/api/v1/carOrder')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Create a Car Order', (done) => {
        const newCarOrder = {
            carInfo: '628b647c614c14993271bbb3',
            place: '623b48094bbcc9bcec2b6269',
            time: '01/01/2023',
            deposit: 5899990000000,
            phone: '12323123',
            note: 'abcd',
        };
        chai.request(server)
            .post('/api/v1/carOrder')
            .set('Authorization', `Bearer ${token}`)
            .send(newCarOrder)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                carOrderId = res.body.carOrder._id;
                done();
            });
    });

    it('Cancel Car Order By Id', (done) => {
        chai.request(server)
            .patch(`/api/v1/carOrder/cancel/${carOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Admin Get All Car Order', (done) => {
        chai.request(server)
            .get(`/api/v1/carOrder/all`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Admin Update Car Order Status By Id', (done) => {
        chai.request(server)
            .patch(`/api/v1/carOrder/${carOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Accepted' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.carOrder.status.should.equal('Accepted');
                done();
            });
    });

    it('Admin Delete Car Order By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/carOrder/${carOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
