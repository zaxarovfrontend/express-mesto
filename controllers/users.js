const User = require('../models/user');

const getUsersInfo = (req,res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.log(err)
    })
}

const getUserId = (req,res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err)
    })
}

const createUser = (req,res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user)=> {res.send(user)})
    .catch((err) => {
      console.log(err)
    })
};


module.exports = {getUsersInfo, getUserId, createUser};
