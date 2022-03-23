const express = require('express');

const router = express.Router();
const showRoomControllers = require('../controllers/showRoomControllers');
const authControllers = require('../controllers/authControllers');

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', showRoomControllers.getAllShowRooms);
router.post('/', authControllers.protect, authControllers.restrictTo('admin', 'manager'), showRoomControllers.createOneShowRoom);
router.put('/:showRoomId', authControllers.protect, authControllers.restrictTo('admin', 'manager'), showRoomControllers.updateOneShowRoom);
router.delete('/:showRoomId', authControllers.protect, authControllers.restrictTo('admin', 'manager'), showRoomControllers.deleteOneShowRoom)

module.exports = router;