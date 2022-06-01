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

describe('---------Login Before Testing Accessory Bill API----------', () => {
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
                done();
            });
    });
});

describe('----------Accessory Bill API----------', () => {
    let accessoryBillId;
    let cart;
    it('User Get Accessory Bill', (done) => {
        chai.request(server)
            .get('/api/v1/accessory-bill')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('User Add Item To Cart', (done) => {
        chai.request(server)
            .patch('/api/v1/user/addItemToCart')
            .set('Authorization', `Bearer ${token}`)
            .send({ itemId: '62737a2feff05a725fa9225b', quantity: 5, color: 'yellow' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                if (res.body.increase) {
                    cart = res.body.increase.cart;
                } else {
                    cart = res.body.add.cart;
                }
                done();
            });
    });

    it('Create a Accessory Bill', (done) => {
        const newAccessoryBill = {
            accessoryInfo: cart,
            totalPrice: 123456,
            deliveryMethod: 'COD',
            place: 'Ktx Khu A, Đại học Quốc gia HCM',
        };
        chai.request(server)
            .post('/api/v1/accessory-bill')
            .set('Authorization', `Bearer ${token}`)
            .send(newAccessoryBill)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                accessoryBillId = res.body.accessoryBill._id;
                done();
            });
    });

    it('Cancel Accessory Bill By Id', (done) => {
        chai.request(server)
            .patch(`/api/v1/accessory-bill/cancel/${accessoryBillId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Admin Get All Accessory Bill', (done) => {
        chai.request(server)
            .get(`/api/v1/accessory-bill/all`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Admin Update Accessory Bill Status By Id', (done) => {
        chai.request(server)
            .patch(`/api/v1/accessory-bill/${accessoryBillId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Accepted' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.updatedAccessoryBill.status.should.equal('Accepted');
                done();
            });
    });

    it('Admin Delete Accessory Bill By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/accessory-bill/${accessoryBillId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
