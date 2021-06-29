const {pbkdf2} = require('crypto');
const jwt = require('jsonwebtoken');
const ChatApp = require('../../Databases/MongoDb.js').db('ChatApp');

// Authenticate user.
async function Login(req, res, next) {

    try {

        const {email, password} = req.body;
        pbkdf2(password, 'salt', 1000, 64, 'sha512', (err, hashPass) => {

            const Pass = hashPass.toString('hex');
            const query = {
                email: email
            }

            // If User with email is present then it will return that document
            // Else it will return null.On receiving null direct user to create
            // new account with given email
            ChatApp.collection('Users').findOne(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({err: "INternal server error"});
                } else if (result) {
                    // console.log(typeof(result.password));
                    // console.log("actual:"+result.password,"\nuserpass:"+Pass);
                    if (Pass === result.password) {
                        const token = jwt.sign({
                            userId: result._id
                        }, process.env.JWT_PRIVATE_KEY, {expiresIn: '1h'});
                        // console.log(result._id);
                        const data = {
                            token: token,
                            name: result.name,
                            email: result.email,
                            userid: result._id,
                            err: null
                        }
                        res.status(200).send(data);
                    } else {
                        res.status(403).send({err: "Wrong Password"})
                    }
                    // res.status(200).send(result);
                } else {
                    res.status(403).send({err: "wrong mail id please register as new User"})
                }
            })


        });

    } catch (err) {
        console.log(err);
        res.status(500).send({err: "Internal Server Error"})
    }

}
module.exports = {
    Login
}
