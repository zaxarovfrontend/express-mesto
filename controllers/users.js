const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserFile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('пользователь с указанным id не найден')))
    .then(((user) => {
      res.status(200).send(user);
    })
      .catch(next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(`необходимо авторизоваться: ${err.message}`));
    });
};

const getUsersInfo = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(new ServerError('некорректный запрос к серверу'));
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('некоректный запрос'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('id пользователя не найден'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.log(err)
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Указанный пользователь уже зарегистрирован'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const userInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некоректные данные при обновления профиля'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('id пользователя не найден'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const avatarUpdate = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некоректные данные при обновления аватара'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('id пользователя не найден'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

module.exports = {
  getUsersInfo, getUserId, createUser, userInfo, avatarUpdate, login, getUserFile,
};
