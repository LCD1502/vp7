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

describe('---------Login Before Testing Showroom API----------', () => {
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

describe('----------Showroom API----------', () => {
    let showroomId;
    it('Get All Showroom', (done) => {
        chai.request(server)
            .get('/api/v1/showRoom/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Post a Showroom', (done) => {
        const newShowroom = {
            name: 'Showroom testing api',
            address: 'khu phố 7, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam',
            description: 'day la noi o cua thang Luong',
            coordinate: {
                longitude: '10.87521912',
                latitude: '106.806142333',
            },
        };
        chai.request(server)
            .post('/api/v1/showRoom/')
            .set('Authorization', `Bearer ${token}`)
            .send(newShowroom)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                showroomId = res.body.data._id;
                done();
            });
    });

    // it('Get Showroom By Id', (done) => {
    //     chai.request(server)
    //         .get(`/api/v1/showRoom/${showroomId}`)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             done();
    //         });
    // });

    it('Update Showroom By Id', (done) => {
        chai.request(server)
            .put(`/api/v1/showRoom/${showroomId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ address: 'new address' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.address.should.equal('new address');
                done();
            });
    });

    it('Delete Showroom By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/showRoom/${showroomId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
