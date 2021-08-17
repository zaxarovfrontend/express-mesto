const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

// возвращает все карточки
const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch(next);
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нет прав для удаления карточки'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch(next);
};

// обновляет лайки карточке
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    // eslint-disable-next-line consistent-return
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    // eslint-disable-next-line consistent-return
    .catch(next);
};

module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
};
