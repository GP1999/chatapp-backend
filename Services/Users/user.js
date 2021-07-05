const mongodb = require('../../Databases/MongoDb.js');
const radisClient = require('../../Databases/radis.js');
const {check} = require('express-validator');
const short = require('short-uuid');
const User = require('../../Modals/User.js')
const {sendOTP} = require('../../Helpers/helpers.js');
const DB = mongodb.db("ChatApp");
const jwt = require('jsonwebtoken');
const UserFriends =require('../../Modals/UserFriends.js');
// API function which will be called during first user creation
// It will store information of users in redis before validating otp
// After validating otp we will store data in Db
async function validateNewUser(req, res, next) {
    try {
        let {email, name, password} = req.body;
        console.log(email, name, password)
        let newUser = new User(email, name, password);
        // Validating User Data
        let validationResult = newUser.isValid();
        if (validationResult.isValid === false) {

            res.status(422).send({err: "email or name is not valid", data: validationResult});

        } else { // Check Where the account with given email is already present or not


            DB.collection('Users').findOne({email: email}).then((result) => {
                // If USer with GIven Email is not Present then
                // save user details in redis database temporarily till
                // we validate OTP and send otp for varification
                if (result == null) {

                    const userId = short.generate();
                    console.log(newUser.getObject());
                    let radisvalue = JSON.stringify(newUser.getObject());
                    let key = 'user-' + userId

                    radisClient.SET(key, radisvalue, function (err, reply) {
                        if (err) {
                            res.status(500).send({err: "Something is wrong"})

                            console.log(err);
                        } else { 
                            // Commenting out only for development and testing purpose
                            // sending OTP
                           // sendOTP(userId, email);
                           // res.status(200).send({userId: userId, err: null})
                            //console.log(reply);
                            //Comment below part on production .This is only for testing user creation
                            //quickly
                            newUser.saveInMongo().then((result, err) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send({err: "Internal server error"});
                                } else {
                                   //Send jwt token for session management
                                   //Token contains userid which will uniquely identify user in future
                                    const token = jwt.sign({
                                        userId: result.ops[0]._id
                                    }, process.env.JWT_PRIVATE_KEY, {expiresIn: '20h'});
                                    res.status(200).send({err: null, userId:result.ops[0]._id,token: token});
                                    console.log("Success Fully User created" ,result.ops[0]._id);
                                    const UserFriend=new UserFriends(result.ops[0]._id);
                                    UserFriend.createDocumetForUser();

                                    // Delete Now User Data which is stored in redis
                                    //radisClient.del(key);
                                }
                            });
                        }
                    });
                } else {
                    res.status(422).send({err: "Email id is already in use,Please enter another email"})
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({err: "Internal server Error"})
    }
}


// Get The OTP from redis and validate it
// If Opt matches then get User data stored in redis
// and store it in Mongodb
async function validateOTP(req, res, next) {

    try {

        const {userid, OTP} = req.body;
        let key = "otp-" + userid;
        console.log(key);

        radisClient.get(key, (err, result) => {
            if (err) 
                console.log(err)
             else if (result === null) {
                res.status(422).send({err: "OTP is expired,Retry again"});
            } else {

                console.log(`actual OTP is ${result} and user entered otp is ${OTP}`);
                if (OTP === result) { // Get User data stored in redis to transfer it to permanent MongoDb storage
                    let key = 'user-' + userid;
                    radisClient.get(key, (err, reply) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({err: "Internal server Error"});
                        } else if (reply) {

                            let data = JSON.parse(reply);
                            console.log(data);
                            let NewUser = new User(data.email, data.name, data.password);
                            NewUser.saveInMongo().then((result, err) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send({err: "Internal server error"});
                                } else {
                                   //Send jwt token for session management
                                   //Token contains userid which will uniquely identify user in future
                                    const token = jwt.sign({
                                        userId: result.ops[0].id
                                    }, process.env.JWT_PRIVATE_KEY, {expiresIn: '20h'});
                                    res.status(200).send({err: null,userId: result.ops[0].id, token: token});
                                    console.log("Success Fully User created");
                                    //Create Users Friend List
                                    const UserFriend=new UserFriends(result.ops[0].id);
                                    UserFriend.createDocumetForUser();

                                    // Delete Now User Data which is stored in redis
                                    radisClient.del(key);
                                }
                            });
                        } else {
                            res.status(400).send({err: "INvalid operation"})
                        }
                    });


                } else {
                    res.status(422).send({err: "Wrong OTP"})
                }
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({err: "Internal Server Error"});
    }
}
module.exports = {
    validateNewUser,
    validateOTP
}
