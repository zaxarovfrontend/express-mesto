const User = require('../models/user');

const getUsersInfo = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'некорректный запрос к серверу' });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'некоректный запрос' });
      } if (err.message === 'NotFound') {
        res.status(404).send({ message: 'id пользователя не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

const userInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданны некоректные данные при обновления профиля' });
      } if (err.message === 'NotFound') {
        res.status(404).send({ message: 'id пользователя не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const avatarUpdate = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданны некоректные данные при обновления аватара' });
      } if (err.message === 'NotFound') {
        res.status(404).send({ message: 'id пользователя не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getUsersInfo, getUserId, createUser, userInfo, avatarUpdate,
};
