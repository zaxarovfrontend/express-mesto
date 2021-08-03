const router = require('express').Router();
const {
  createCard, getCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);
// создание карточки
router.post('/cards', createCard);
// получение лайка карточки
router.put('/cards/:cardId/likes', likeCard);
// удаление карточки
router.delete('/cards/:cardId', deleteCard);
// удаление лайка с карточки
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
