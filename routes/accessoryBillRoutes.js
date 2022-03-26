const express = require('express');

const router = express.Router();
const accessoryBillControllers = require('../controllers/accessoryBillControllers');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

//user get and create bill
router.get('/',  authControllers.protect, authControllers.restrictTo('user','admin','manager'),accessoryBillControllers.getUserAccessoryBill);
router.post('/', authControllers.protect, authControllers.restrictTo('user','admin','manager'), accessoryBillControllers.createOneAccessoryBill);

//admin and mamager bill
router.get('/all', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.getAllAccessoryBills);
// router.post('/', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.createOneAccessoryBill);
// router.put('/:accessoryId', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.updateOneAccessoryBill);
// router.delete('/:accessoryId', authControllers.protect, authControllers.restrictTo('admin','manager'), accessoryBillControllers.deleteOneAccessoryBill)

module.exports = router;