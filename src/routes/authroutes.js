const express = require('express');
const {
  userRegisteration,
  userLogin,
 
  userLogout,
} = require('../controllers/authController');


const router = express.Router();


router.post('/register', userRegisteration);


router.post('/login', userLogin);


router.get('/logout', userLogout);



module.exports = router;
