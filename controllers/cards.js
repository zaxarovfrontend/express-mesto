const Card = require('../models/card');

// возвращает все карточки
const getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'некорректный запрос к серверу' }));
};

// создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некоректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'некоректный запрос' });
      } if (err.message === 'NotFound') {
        res.status(404).send({ message: 'карточка с указанным id не найдена' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// обновляет лайки карточке
const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданны некоректные данные для постановки/снятия лайка' });
      } if (err.message === 'NotFound') {
        res.status(404).send({ message: 'карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданны некоректные данные для постановки/снятия лайка' });
      }
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
};
