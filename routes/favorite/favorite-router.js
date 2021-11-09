'use strict';

const { Router, json } = require('express');
const debug = require('debug')('backend:favorite-router');
const createError = require('http-errors');

const Favorite = require('../../model/favorite/favorite.js');
const Profile = require('../../model/user/profile.js');
const bearerAuth = require('../../lib/bearer-auth-middleware.js');

const favoriteRouter = module.exports = Router();

// creates a new favorite and adds it users favorites
// http POST :3000/api/favorite 'Authorization:Bearer token' favoriteId='my_favoriteId' nickname='my_nickname' bus='my_bus' stop='my_stop'
favoriteRouter.post('/api/favorite', bearerAuth, json(), (req, res, next) => {
  debug(`POST: /api/favorite`);

  const { favoriteId, nickname, bus, stop  } = req.body;
  const message = !favoriteId ? 'expected a favorite favoriteId'
    : !nickname ? 'expected a favorite nickname'
      : !bus ? 'expected a favorite bus'
        : !stop ? 'expected a stop'
          : null;
  if (message)
    return next(createError(400, `BAD REQUEST ERROR: ${message}`));

  Favorite.findOne({ favoriteId: favoriteId, nickname: nickname, bus: bus, stop: stop })
    .then(favorite => {
      if(!favorite) {
        return new Favorite({ favoriteId: favoriteId, nickname: nickname, bus: bus, stop: stop }).save()
          .catch(next);
      }
      return favorite;
    })
    .then(favorite => {
      return Profile.findOneAndUpdate({ userID: req.user._id }, { $push: { favorites: favorite._id }})
        .then(() => res.json(favorite))
        .catch(next);
    })
    .catch(next);
});

// fetches all favorites of a logged in user, actually get route
// http POST :3000/api/favorites/user 'Authorization:Bearer token' favorites:='["ids", "ids"]'
favoriteRouter.post('/api/favorites/user', bearerAuth, json(), (req, res, next) => {
  debug('POST: /api/favorites/user');

  const { favorites } = req.body;
  const message = !favorites ? 'expected a favorite' : null;

  if (message)
    return next(createError(400, `BAD REQUEST ERROR: ${message}`));

  Favorite.find( { _id: { $in: favorites} } )
    .then(favs => {
      if(!favs)
        return next(createError(404, 'NOT FOUND ERROR: favorites not found'));
      res.json(favs);
    })
    .catch(next);
});

// remove a favorite from a users profile
// http PUT :3000/api/favorite/:favoriteID/remove 'Authorization:Bearer token'
favoriteRouter.put('/api/favorite/:favoriteID/remove', bearerAuth, json(), (req, res, next) => {
  debug('PUT: /api/favorite/:favoriteID/remove');

  Profile.findOneAndUpdate({ userID: req.user._id }, { $pull: { favorites: req.params.favoriteID}}, { new: true })
    .then(() => res.json(req.params.favoriteID))
    .catch(next);
});
