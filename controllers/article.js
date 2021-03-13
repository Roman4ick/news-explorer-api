const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .populate('owner')
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .select('+owner')
    .orFail(() => new NotFoundError('Такой карточки нет в базе'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав!');
      } 
         return Article.deleteOne(article)
          .then((articles) => {
            res.send({ message: 'Карточка удалена!' });
          });
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
