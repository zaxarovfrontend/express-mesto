const router = require('express').Router();
const {getUsersInfo, getUserId, createUser} = require('../controllers/users');

router.get('/users', getUsersInfo);
router.get('/users/:userId',getUserId);
router.post('/users', createUser);

module.exports = router;