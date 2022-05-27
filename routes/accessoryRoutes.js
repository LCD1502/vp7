const express = require('express');

const router = express.Router();
const accessoryControllers = require('../controllers/accessoryControllers');
const authControllers = require('../controllers/authControllers');

router.get('/', accessoryControllers.getAllAccessories);
router.get('/accessoryFilter', accessoryControllers.accessoryFilter);
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
