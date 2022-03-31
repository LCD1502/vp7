const express = require('express');

const router = express.Router();
const postControllers = require('../controllers/postControllers');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', postControllers.getAllPosts);
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
