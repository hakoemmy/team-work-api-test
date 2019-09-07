
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../helpers/statusCode';

import user from '../models/fakerData/user';

const { expect } = chai;

chai.use(chaiHttp);


// ############ SIGNUP TEST BEGINS ############

// for non existing Uri
describe('POST api/v1/auth/signup when no valid URL endpoint exist', () => {
  it('should return such Uri does not exist on our server', (done) => {
    chai.request(app)
      .post('/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.NOT_FOUND);
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.message).to.equal('Welcome to TeamWork API!');
        done();
      });
  });
});
// For invalid contenty type
describe('POST api/v1/auth/signup Content type not supported', () => {
  it('should return content type is unsupported', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'text/plain')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.UNSUPPORTED_CONTENT_TYPE);
        expect(res.body.status).to.equal(status.UNSUPPORTED_CONTENT_TYPE);
        expect(res.body.error).to.equal('content type for request must be application/json');
        done();
      });
  });
});

// For invalid JSON format
describe('POST api/v1/auth/signup misspelling in JSON format', () => {
  it('should return request is invalid JSON format', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send('{"invalidJson"}')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('it seems that JSON request is invalid!');
        done();
      });
  });
});
// For JOI NPM thrown errors
describe('POST api/v1/auth/signup firstName is missing', () => {
  it('should return firstName is required', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"firstName" is required');
        done();
      });
  });
});

//  for empty data
describe('POST api/v1/auth/signup some fileds in payload are empty', () => {
  it('should return request has empty fields', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[1])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('firstName, lastName, address, gender, jobRole, department,password  can\'t be empty');
        done();
      });
  });
});

//  for unallowed data
describe('POST api/v1/auth/signup some fileds can not be numbers', () => {
  it('should return request has some unallowed data', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('firstName, lastName, JobRole, depatment and address can\'t be a number!');
        done();
      });
  });
});

// Testing allowed gender
describe('POST api/v1/auth/signup gender must be valid', () => {
  it('should return gender must be valid one', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[3])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('it seems that gender is invalid!');
        done();
      });
  });
});

// Testing for email existence
describe('POST api/v1/auth/signup email must be unique', () => {
  it('should return email exists there', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[4])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_CONFLICT);
        expect(res.body.status).to.equal(status.REQUEST_CONFLICT);
        expect(res.body.error).to.equal('Email is already taken!');
        done();
      });
  });
});

// Testing for sinUp successfully
describe('POST api/v1/auth/signup creating employee account', () => {
  it('should return account is created successfully', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(user[5])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.message).to.equal('User created successfully');
        done();
      });
  });
});

// ############ SIGNUP TEST ENDS ############


// ############ SIGN IN TEST BEGINS ############

// For JOI NPM thrown errors
describe('POST api/v1/auth/signin email is missing', () => {
  it('should return email is required', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(user[6])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"email" is required');
        done();
      });
  });
});

// For login success
describe('POST api/v1/auth/signin employee signin success', () => {
  it('should return user is signed successfully', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(user[7])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.message).to.equal('User is successfully logged in');
        done();
      });
  });
});

// For login failure
describe('POST api/v1/auth/signin employee signin failure', () => {
  it('should return user is not logged in', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .send(user[8])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.UNAUTHORIZED);
        expect(res.body.status).to.equal(status.UNAUTHORIZED);
        expect(res.body.error).to.equal('email or password is incorrect!');
        done();
      });
  });
});
// ############ SIGN IN TEST ENDS ############
