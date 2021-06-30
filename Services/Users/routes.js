let express = require('express');
let router = express.Router();
const {validateNewUser,validateOTP}=require('./user.js');
const {Login,Authenticate}=require('./Authentication.js')

//Post request to create user and save temporarily in redis db
router.post('/newuser',validateNewUser);

//Post request to validate otp and save in Mongodb as permanent users
router.post('/validate_otp',validateOTP);

//Login user 
router.post('/login',Login);

//Authenticate user after login 
router.post('authenticate',Authenticate);

module.exports=router
