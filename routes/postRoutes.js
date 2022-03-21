const express = require('express');

const router = express.Router();
const postControllers = require('../controllers/postControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', postControllers.getAllPosts);
router.post('/', postControllers.createOnePost);
router.put('/:postId', postControllers.updateOnePost);
router.delete('/:postId', postControllers.deleteOnePost)

module.exports = router;