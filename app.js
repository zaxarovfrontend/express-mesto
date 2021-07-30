const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');


const usersRoute = require("./routes/users");

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});




app.use((req, res, next) => {
  req.user = {
    _id: '6103f1d52ef7e52e94e8f3fa' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});


app.use('/', express.json());
app.use("/", usersRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

