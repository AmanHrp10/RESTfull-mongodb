const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup', userController.user_create); //! create user
router.post('/login', userController.user_login);  //* login
router.delete('/:userId', userController.user_delete);  //! delete user

module.exports = router