import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../helpers/statusCode';

import comment from '../models/fakerData/comment';
import generateAuthToken from '../helpers/tokenEncoder';

const { expect } = chai;

chai.use(chaiHttp);

const validToken = generateAuthToken(1);
// token with access to editing article
const ownerToken = generateAuthToken(2);

const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY3ODU2NTczfQ.WqwWVxxt9J8EN03toJM7K1QQBbTCJKe3lV-32axH';

// ############ POST COMMENT TEST BEGINS HERE ############

// Test for Invalid token
describe('POST api/v1/articles/:articleId with Invalid signature token', () => {
  it('should return Invalid token', (done) => {
    chai.request(app)
      .post('/api/v1/articles/2/comments')
      .set('Accept', 'application/json')
      .set('x-auth-token', invalidToken)
      .send(comment[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        done();
      });
  });
});

// For missing field
describe('POST api/v1/articles comment field is missing', () => {
  it('should return comment is required', (done) => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(comment[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"comment" is required');
        done();
      });
  });
});

//  article Id an not be a string
describe('POST /api/v1/articles/:articleId/comments articleId param', () => {
  it('should return articleId param can not be a string', (done) => {
    chai.request(app)
      .post('/api/v1/articles/mm/comments')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(comment[1])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('articleId can\'t be a string!');
        done();
      });
  });
});

// Does article id exist
describe('POST /api/v1/articles/:articleId/comments', () => {
  it('should return comment can not be empty', (done) => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('x-auth-token', validToken)
      .send(comment[1])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('comment can\'t be empty');
        done();
      });
  });
});

// Does Non existence article
describe('POST /api/v1/articles/:articleId/comments artilceId param', () => {
  it('should return article is not found', (done) => {
    chai.request(app)
      .post('/api/v1/articles/900/comments')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('x-auth-token', validToken)
      .send(comment[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.error).to.equal('Such article is not found!');
        done();
      });
  });
});

// Successfully POST a comment
describe('POST /api/v1/articles/:articleId/comments adding comment', () => {
  it('should return comment successfully added', (done) => {
    chai.request(app)
      .post('/api/v1/articles/2/comments')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('x-auth-token', validToken)
      .send(comment[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.message).to.equal('comment successfully added');
        done();
      });
  });
});
// ############ POST COMMENT TEST ENDS HERE ############
