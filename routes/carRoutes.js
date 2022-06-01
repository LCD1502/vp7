const express = require('express');

const router = express.Router();
const carControllers = require('../controllers/carControllers');
const authControllers = require('../controllers/authControllers');

router.get('/', carControllers.getAllCars);
router.get('/carFilter', carControllers.carFilter);
router.get('/:carId', carControllers.getOneCar);
router.get('/compareTwoCars', carControllers.compareTwoCars);
router.post('/', authControllers.protect, authControllers.restrictTo('admin', 'manager'), carControllers.createOneCar);
router.put(
    '/:carId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carControllers.updateOneCar
);
router.delete(
    '/:carId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    carControllers.deleteOneCar
);

//router.put('/updateOneCar', carControllers.updateOneCar);
//router.delete('/deleteOneCar', carControllers.deleteOneCar);

module.exports = router;
