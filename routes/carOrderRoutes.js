const express = require('express');

const router = express.Router();
const carOrderControllers = require('../controllers/carOrderController');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('time: ', Date.now());
    next();
});

router.get(
    '/',
    authControllers.protect,
    authControllers.restrictTo('user', 'admin', 'manager'),
    carOrderControllers.getCarOrder
);

router.post(
    '/',
    authControllers.protect,
    authControllers.restrictTo('user', 'admin', 'manager'),
    carOrderControllers.createCarOrder
);

// admin and manager
router.get(
    '/all',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.getAllCarOrder
);
//Check postman
router.patch(
    '/:updateCarOrder',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.updateCarOrder
);

router.delete(
    '/deleteCarOrder',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.deleteCarOrder
);

module.exports = router;
