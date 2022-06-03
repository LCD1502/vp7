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

describe('---------User Authentication Testing----------', () => {
    it('Signup', (done) => {
        chai.request(server)
            .post('/api/v1/user/signup')
            .send({
                email: 'chai-testing@gmail.com',
                name: 'lcd',
                password: '12345678',
                passwordConfirmation: '12345678',
                info: {
                    phoneNumber: '010101',
                    dateOfBirth: '01/01/1990',
                },
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('Login', (done) => {
        chai.request(server)
            .post('/api/v1/user/logIn')
            .send({
                email: 'chai-testing2@gmail.com',
                password: '12345678',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('Update Password', (done) => {
        chai.request(server)
            .post('/api/v1/user/updatePassword')
            .set('Authorization', `Bearer ${token}`)
            .send({
                currentPassword: '12345678',
                newPassword: '1234567899',
                passwordConfirmation: '1234567899',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('Logout', (done) => {
        chai.request(server)
            .get('/api/v1/user/logOut')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
