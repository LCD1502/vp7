const express = require('express');

const router = express.Router();
const authControllers = require('../controllers/authControllers');
const userControllers = require('../controllers/userController');

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', (req, res) => {
    res.send('Users home page');
});
// define the about route
router.post('/signup', authControllers.signUp);
router.post('/logIn', authControllers.logIn);
router.get('/logOut', authControllers.logOut);

// Because middle run in sequence, we use PROTECT middleware to protect all rote after this line.

// User must login to access route
//------ PROTECTED ROUTES --------
router.use(authControllers.protect);

router.post('/updatePassword', authControllers.updatePasswords);
router.get('/getMe', userControllers.getMe);
router.patch('/updateInfo', userControllers.updateInfo);
router.patch('/updateCart', userControllers.updateCart);
router.get('/testFilter', userControllers.testFilter);

// --- RESTRICT TO ADMIN ---
router.use(authControllers.restrictTo('admin'));

router.get('/getUser', userControllers.getUser);
router.get('/getAllUser', userControllers.getAllUser);

module.exports = router;
