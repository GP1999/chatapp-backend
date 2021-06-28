let express = require('express');
let router = express.Router();
const {validateNewUser,validateOTP}=require('./user.js');

//Post request to create user and save temporarily in redis db
router.post('/newuser',validateNewUser);

//Post request to validate otp and save in Mongodb as permanent users
router.post('/validate_otp',validateOTP);

module.exports=router
