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

describe('---------Login Before Testing Accessory API----------', () => {
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

describe('----------Accessory API----------', () => {
    let accessoryId;
    it('Get All Accessory', (done) => {
        chai.request(server)
            .get('/api/v1/accessory/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Post an Accessory', (done) => {
        const newAccessory = {
            name: 'đèn xe BMW',
            code: 'chai-testing',
            price: '200000',
            type: 'glass',
            image: {
                avatar: 'avatar',
                banner: 'banner',
            },
            amount: 100,
            description: 'none',
            warrantyPeriod: 1,
            specification: {
                height: '100',
                weight: '0.5',
            },
            color: ['yellow', 'red'],
        };
        chai.request(server)
            .post('/api/v1/accessory/')
            .set('Authorization', `Bearer ${token}`)
            .send(newAccessory)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                accessoryId = res.body.data._id;
                done();
            });
    });

    it('Get Accessory By Id', (done) => {
        chai.request(server)
            .get(`/api/v1/accessory/${accessoryId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Update Accessory By Id', (done) => {
        chai.request(server)
            .put(`/api/v1/accessory/${accessoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'new name' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.name.should.equal('new name');
                done();
            });
    });

    it('Delete Accessory By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/accessory/${accessoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
