const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const routerarticle = require('express').Router();
const { getArticle, deleteArticle, createArticle } = require('../controllers/article');

routerarticle.get('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getArticle);
routerarticle.delete('/articles/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.objectId().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), deleteArticle);
routerarticle.post('/articles', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
  }),
}), createArticle);
module.exports = routerarticle;
