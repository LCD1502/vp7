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

describe('---------Login Before Testing Post API----------', () => {
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

describe('----------Post API----------', () => {
    let postId;
    it('Get All Post', (done) => {
        chai.request(server)
            .get('/api/v1/post/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Create a Post', (done) => {
        const newPost = {
            content: 'test content',
            title: 'test title',
            image: {
                avatar: 'test avt',
                banner: 'test banner',
            },
        };
        chai.request(server)
            .post('/api/v1/post/')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                postId = res.body.data._id;
                done();
            });
    });

    it('Get Post By Id', (done) => {
        chai.request(server)
            .get(`/api/v1/post/${postId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('Update Post By Id', (done) => {
        chai.request(server)
            .put(`/api/v1/post/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'new title' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.title.should.equal('new title');
                done();
            });
    });

    it('Delete Post By Id', (done) => {
        chai.request(server)
            .delete(`/api/v1/post/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
