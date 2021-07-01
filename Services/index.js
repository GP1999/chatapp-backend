let express = require('express');
let router = express.Router();
const userRoute=require('./Users/routes.js');

router.use('/user',userRoute);

module.exports=router
