const Card = require('../models/card');



//возвращает все карточки
const getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      console.log(err)
    })
}

//создаёт карточку
const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id
  Card.create({name, link, owner})
    .then((card) => {
      res.status(200).send(card)
    })
    .catch();
}

//удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send(card)
    })
    .catch();
}

//обновляет лайки карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
    {new: true},
  )
    .then((card) => {
      res.status(200).send(card)
    })
    .catch();
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$pull: {likes: req.user._id}}, // убрать _id из массива
    {new: true},
  )
    .then((card) => {
      res.status(200).send(card)
    })
    .catch();
}


module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard
};