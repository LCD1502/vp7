const express = require('express');

const router = express.Router();
const carControllers = require('../controllers/carControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', carControllers.getAllCars);
router.post('/', carControllers.createOneCar);
router.put('/:carId', carControllers.updateOneCar);
router.delete('/:carId', carControllers.deleteOneCar)

//router.put('/updateOneCar', carControllers.updateOneCar);
//router.delete('/deleteOneCar', carControllers.deleteOneCar);


module.exports = router;