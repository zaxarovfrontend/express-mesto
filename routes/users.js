const router = require('express').Router();
const {getUsersInfo,getUserId,createUser,userInfo,avatarUpdate} = require('../controllers/users');

//возвращает всех пользователей
router.get('/users', getUsersInfo);
//возвращает пользователя по id
router.get('/users/:userId',getUserId);
//создает пользователя
router.post('/users', createUser);
//обновляет информация о пользователе
router.patch('/users/me',userInfo);
//обновляет аватар
router.patch('/users/me/avatar',avatarUpdate);

module.exports = router;