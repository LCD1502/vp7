const express = require('express');

const router = express.Router();
const carOrderControllers = require('../controllers/carOrderController');
const authControllers = require('../controllers/authControllers');

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

router.get(
    '/detail/:carOrderId',
    authControllers.protect,
    authControllers.restrictTo('user', 'admin', 'manager'),
    carOrderControllers.getCarOrderDetail
);

router.patch('/cancel/:carOrderId', authControllers.protect, carOrderControllers.cancelCarOrder);

// admin and manager
router.get(
    '/all',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.getAllCarOrder
);
//Check postman
router.patch(
    '/:carOrderId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.updateCarOrder
);

router.delete(
    '/:carOrderId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carOrderControllers.deleteCarOrder
);

module.exports = router;
