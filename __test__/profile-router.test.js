'use strict';

const request = require('superagent');
const fakeProfile  = require('./lib/fakeProfile.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const url = 'http://localhost:3000';
const updatedProfile = { username: 'updatedUserName'};

describe('Profile routes', function() {
  beforeAll( done => serverToggle.serverOn(server, done));
  afterAll( done => serverToggle.serverOff(server, done));
  beforeEach( done => {
    return fakeProfile.create()
      .then( mock => {
        this.mock = mock;
        return done();
      })
      .catch(done);
  });
  afterEach(done => {
    return Promise.all([
      fakeProfile.remove(),
    ])
      .then(() => done())
      .catch(done);
  });

  describe('GET: /api/profile/:profileId', () => {
    describe('with a valid body', () => {
      it('should return a profile', done => { 
        request.get(`${url}/api/profiles/currentuser`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            expect(res.body._id.toString()).toEqual(this.mock.profile._id.toString());
            expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
            expect(res.body.username).toEqual(this.mock.profile.username);
            done();
          });
      });
      it('should return a 401 when no token is provided', done => {
        request.get(`${url}/api/profiles/currentuser`)
          .set({
            Authorization: 'Bearer',
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
      it('should return a 404 for a valid req with a profile not found', done => {
        request.get(`${url}/api/profiles/current`)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });

  describe('PUT: /api/profile/:profileId', () => {
    describe('with a valid body', () => {
      it('should update and return a list with a 200 status', done => {
        request.put(`${url}/api/profile/${this.mock.profile._id}`)
          .send(updatedProfile)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.username).toEqual(updatedProfile.username);
            expect(res.body.userID.toString()).toEqual(this.mock.profile.userID.toString());
            done();
          });
      });
      it('should  not update and return a 401 status', done => {
        request.put(`${url}/api/profile/${this.mock.profile._id}`)
          .send(updatedProfile)
          .set({
            Authorization: `Bearer `,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
      it('should  not update and return a 404 status for profile not found', done => {
        request.put(`${url}/api/profile/arebrweberber`)
          .send(updatedProfile)
          .set({
            Authorization: `Bearer ${this.mock.token}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });
});