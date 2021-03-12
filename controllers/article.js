const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ article }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteArticle = (req, res, next) => {
  const articleId = req.params._id;
  Article.findOne(articleId)
    .orFail(new NotFoundError('Такой карточки нет в базе'))
    .then((article) => {
      if (article.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав!');
      } else {
        Article.findOneAndRemove(articleId)
          .then((articles) => {
            res.send({ data: articles });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title,
    text, date,
    source, image,
    link,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    image,
    link,
    owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
