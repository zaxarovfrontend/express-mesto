const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/card');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6108f0fb21bd7512485d5e18', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/', express.json());
app.use('/', usersRoute);
app.use('/', cardsRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
