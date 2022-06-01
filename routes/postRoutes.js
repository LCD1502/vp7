const express = require('express');

const router = express.Router();
const postControllers = require('../controllers/postControllers');
const authControllers = require('../controllers/authControllers');

router.get('/', postControllers.getAllPosts);
router.get('/:postId', postControllers.getOnePost);
router.post(
    '/',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    postControllers.createOnePost
);
router.put(
    '/:postId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    postControllers.updateOnePost
);
router.delete(
    '/:postId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    postControllers.deleteOnePost
);

module.exports = router;
