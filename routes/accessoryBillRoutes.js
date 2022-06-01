const express = require('express');

const router = express.Router();
const accessoryBillControllers = require('../controllers/accessoryBillControllers');
const authControllers = require('../controllers/authControllers');

//user get and create bill
router.get(
    '/',
    authControllers.protect,
    authControllers.restrictTo('user', 'admin', 'manager'),
    accessoryBillControllers.getUserAccessoryBill
);
router.post(
    '/',
    authControllers.protect,
    authControllers.restrictTo('user', 'admin', 'manager'),
    accessoryBillControllers.createUserAccessoryBill
);

router.patch('/cancel/:accessoryBillId', authControllers.protect, accessoryBillControllers.cancelAccessoryBill);

//admin and mamager bill
router.get(
    '/all',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryBillControllers.getAllAccessoryBills
);
router.patch(
    '/:accessoryBillId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryBillControllers.updateOneAccessoryBill
);

router.delete(
    '/:accessoryBillId',
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    accessoryBillControllers.deleteOneAccessoryBill
);

// router.post('/', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.createOneAccessoryBill);
// router.delete('/:accessoryId', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.deleteOneAccessoryBill)

module.exports = router;
