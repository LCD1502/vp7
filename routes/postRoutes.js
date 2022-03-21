const express = require('express');

const router = express.Router();
const postControllers = require('../controllers/postControllers');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/',postControllers.getAllPosts);
router.post('/', authControllers.protect,postControllers.createOnePost);
router.put('/:postId', authControllers.protect,postControllers.updateOnePost);
router.delete('/:postId',authControllers.protect, postControllers.deleteOnePost)

module.exports = router;