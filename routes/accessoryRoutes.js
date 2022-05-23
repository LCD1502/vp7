const express = require('express');

const router = express.Router();
const accessoryControllers = require('../controllers/accessoryControllers');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', accessoryControllers.getAllAccessories);
router.get('/filter', accessoryControllers.accessoryFilter);
router.get('/searchAccessory', accessoryControllers.searchAccessory);
router.get('/:accessoryId', accessoryControllers.getOneAccessory);
router.post(
    '/',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryControllers.createOneAccessory
);
router.put(
    '/:accessoryId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryControllers.updateOneAccessory
);
router.delete(
    '/:accessoryId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryControllers.deleteOneAccessory
);

module.exports = router;
