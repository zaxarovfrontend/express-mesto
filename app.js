const express = require('express');
const crypto = require('crypto'); // экспортируем crypto
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors, celebrate, Joi } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/card');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const NotFoundError = require('./errors/not-found-error');

const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex'); // приведём её к строке
console.log(randomString);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().required().min(3).max(15),
    about: Joi.string().required().min(3).max(15),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([/\w \\.-]*)*\/?$/),
  }),
}), createUser);

app.use(auth);
app.use('/', express.json());
app.use('/', usersRoute);
app.use('/', cardsRoute);
app.all('*', (req, res, next) => {
  next(new NotFoundError('ресурс не найден.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
