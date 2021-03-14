const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const routerusers = require('express').Router();
const { getUserMe } = require('../controllers/users');

routerusers.get('/users/me', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserMe);

module.exports = routerusers;
