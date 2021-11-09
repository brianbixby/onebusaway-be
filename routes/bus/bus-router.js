'use strict';

const { Router, json } = require('express');
const axios = require('axios');
const debug = require('debug')('backend:bus-router');

const busRouter = module.exports = Router();

busRouter.get('/api/agencies-with-coverage', json(), (req, res, next) => {
  debug(`GET: /api/agencies-with-coverage`);

  const url = `http://api.pugetsound.onebusaway.org/api/where/agencies-with-coverage.json?key=${process.env.API_KEY}`;
  axios.get(url)
    .then(data => res.json(data))
    .catch(next);
});

busRouter.get('/api/routes-for-agency/:id', json(), (req, res, next) => {
  debug(`GET: /api/routes-for-agency/:id`);

  const url = `http://api.pugetsound.onebusaway.org/api/where/routes-for-agency/${req.params.id}.json?key=${process.env.API_KEY}`;
  axios.get(url)
    .then(data => res.json(data))
    .catch(next);
});

busRouter.get('/api/stops-for-route/:id', json(), (req, res, next) => {
  debug(`GET: /api/stops-for-route/:id`);

  const url = `http://api.pugetsound.onebusaway.org/api/where/stops-for-route/${req.params.id}.json?key=${process.env.API_KEY}`;
  axios.get(url)
    .then(data => res.json(data))
    .catch(next);
});

busRouter.get('/api/stops-for-location/:lat/:lng', json(), (req, res, next) => {
  debug(`GET: /api/stops-for-location/:lat/:lng`);

  const url = `http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=${process.env.API_KEY}&lat=${req.params.lat}&lon=${req.params.lng}`;
  axios.get(url)
    .then(data => res.json(data))
    .catch(next);
});
