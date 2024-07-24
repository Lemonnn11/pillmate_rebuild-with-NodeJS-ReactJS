const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController');

describe('Auth Controller', () => {
  describe('Test protect routes', () => {
    it('Test throw err if no authorization Bearer header in request', done => {
      const req = {
        headers: {
          authorization: null
        }
      };
      authController
        .protect(req, {}, () => {})
        .then(_ => done())
        .catch(err => {
          expect(err.message).to.equal(
            'Please log in to get access to certain resources'
          );
          done();
        });
    });
  });
});
