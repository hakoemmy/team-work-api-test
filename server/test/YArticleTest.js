import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../helpers/statusCode';

import article from '../models/fakerData/article';
import generateAuthToken from '../helpers/tokenEncoder';

const { expect } = chai;

chai.use(chaiHttp);

const validToken = generateAuthToken(1);
// token with access to editing article
const ownerToken = generateAuthToken(2);
// No token provided
const noToken = ' ';
// No user associated with this token
const noUserWithToken = generateAuthToken(89);


const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY3ODU2NTczfQ.WqwWVxxt9J8EN03toJM7K1QQBbTCJKe3lV-32axH';

// ############ POST ARTICLE TEST BEGINS HERE ############
// For JOI NPM thrown errors
describe('POST api/v1/articles title is missing', () => {
  it('should return title is required', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(article[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"title" is required');
        done();
      });
  });
});

//  for empty data
describe('POST api/v1/articles some fileds in payload are empty', () => {
  it('should return request has empty fields', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(article[1])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('title or article can\'t be empty');
        done();
      });
  });
});

//  for unallowed data
describe('POST api/v1/auth/articles title and article can not be numbers!', () => {
  it('should return request has some unallowed data', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article[2])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('title or article can\'t be a number!');
        done();
      });
  });
});
// Creating an article
describe('POST api/v1/articles creating an article', () => {
  it('should return an article is created successfully', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.message).to.equal('article successfully created');
        done();
      });
  });
});

// Test for invalid token
describe('POST api/v1/articles creating an article with Invalid token', () => {
  it('should return an article failed', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', invalidToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        done();
      });
  });
});

// Test for no token provided
describe('POST api/v1/articles creating an article with no token', () => {
  it('should return creating an article failed', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', noToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.UNAUTHORIZED);
        expect(res.body.status).to.equal(status.UNAUTHORIZED);
        expect(res.body.error).to.equal('System rejected. No access token found!');
        done();
      });
  });
});

// Test for no token with no corresponding user
describe('POST api/v1/articles creating an article with invalid token', () => {
  it('should return creating an article failed', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', noUserWithToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.error).to.equal('Awww, Snap!..Such kind of access token does not match any employee!');
        done();
      });
  });
});

// ############ POST ARTICLE TEST ENDS HERE ############

// ############ EDIT ARTICLE TEST BEGINS HERE ############
// For JOI NPM thrown errors
describe('PATCH api/v1/articles/:articleId title is missing', () => {
  it('should return title is required', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(article[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"title" is required');
        done();
      });
  });
});

//  for empty data
describe('PATCH api/v1/articles/:articleId some fileds in payload are empty', () => {
  it('should return request has empty fields', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .send(article[1])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('title or article can\'t be empty');
        done();
      });
  });
});

//  for unallowed data
describe('PATCH api/v1/articles/:articleId title and article can not be numbers!', () => {
  it('should return request has some unallowed data', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .send(article[2])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('title or article can\'t be a number!');
        done();
      });
  });
});

//  article Id an not be a string
describe('PATCH api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param can not be a string', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/mm')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('articleId can\'t be a string!');
        done();
      });
  });
});

//  article Id is not found
describe('PATCH api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param is not found', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/900')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.error).to.equal('Such article is not found!');
        done();
      });
  });
});

//  testing owner of an article
describe('PATCH api/v1/articles/:articleId article ownership', () => {
  it('should return you are not owner of an article', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.FORBIDDEN);
        expect(res.body.status).to.equal(status.FORBIDDEN);
        expect(res.body.error).to.equal('Aww snap!.. you are not the owner of an article');
        done();
      });
  });
});

//  Edit article success ASAP
describe('PATCH api/v1/articles/:articleId article ', () => {
  it('should return article successfully edited', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .send(article[3])
      .set('x-auth-token', ownerToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.message).to.equal('article successfully edited');
        done();
      });
  });
});
// ############ EDIT ARTICLE TEST ENDS HERE ############


// ############ DELETE ARTICLE TEST BEGINS HERE ############

//  article Id an not be a string
describe('DELETE api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param can not be a string', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/mm')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('articleId can\'t be a string!');
        done();
      });
  });
});

//  article Id is not found
describe('DELETE api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param is not found', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/900')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.error).to.equal('Such article is not found!');
        done();
      });
  });
});

//  testing owner of an article
describe('DELETE api/v1/articles/:articleId article ownership', () => {
  it('should return you are not owner of an article', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .set('x-auth-token', validToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.FORBIDDEN);
        expect(res.body.status).to.equal(status.FORBIDDEN);
        expect(res.body.error).to.equal('Aww snap!.. you are not the owner of an article');
        done();
      });
  });
});

//  Edit article success ASAP
describe('DELETE api/v1/articles/:articleId article ', () => {
  it('should return article successfully deleted', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/1')
      .set('Accept', 'application/json')
      .set('x-auth-token', ownerToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.message).to.equal('article successfully deleted');
        done();
      });
  });
});
// ############ DELETE ARTICLE TEST ENDS HERE ############

// ############ GET ALL ARTICLEs TEST BEGINS HERE ############

describe('GET api/v1/feeds Get all articles ', () => {
  it('should return an array of All artiles ', (done) => {
    chai.request(app)
      .get('/api/v1/feeds')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.message).to.equal('success');
        done();
      });
  });
});

// ############ GET ALL ARTICLEs TEST ENDS HERE ############


// ############ GET A Specific Article TEST BEGINS HERE ############

//  article Id an not be a string
describe('GET api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param can not be a string', (done) => {
    chai.request(app)
      .get('/api/v1/articles/mm')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('articleId can\'t be a string!');
        done();
      });
  });
});


//  article Id is not found
describe('GET api/v1/articles/:articleId articleId param', () => {
  it('should return articleId param is not found', (done) => {
    chai.request(app)
      .get('/api/v1/articles/900')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.error).to.equal('Such article is not found!');
        done();
      });
  });
});


//  Get a certain article by Id
describe('GET api/v1/articles/:articleId Get article by Id', () => {
  it('should return acertain article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/2')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        done();
      });
  });
});


// ############ GET A Specific Article TEST ENDS HERE ############
