const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const Queue = require('bull');
const nodemailer = require('nodemailer');
const radisClient = require('../Databases/radis.js')


// Defining Job Queue for otp sending
let OtpQueue = new Queue('otp', process.env.REDIS_URI);
// Defining SMTP transporter for sending Email to client
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})
// It is used for sending otp to every client which are in queue
OtpQueue.process(async (job, done) => {
    try {
        let OTP = generateOTP();
        let key = "otp-" + job.data.userid;

        // set otp value in radis for future use of varification
        radisClient.set(key, OTP, (err, reply) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`key is ${key} and otp is ${OTP}`);
            }
        })
        // OTP will be valid for only 5 min after that it will autometically gets deleted
        // from radis database
        radisClient.expire(key, 60 * 5);

        // Deleting userid from data object which would make it
        // supported object for sending mail
        let mail = {
            to: job.data.email,
            from: process.env.EMAIL,
            subject: "Application OPT",
            text: `Your OTP is ${OTP}`
        }

        console.log(mail);
        //Send mail using transporter
        transporter.sendMail(mail, (err, result) => {
            if (err) {
                console.log(err);
                done(new Error("Error ocuured in email sending"));
            } else {
                console.log("Email sent to", mail.to);
                done();
            }
        })
    } catch (err) {
        console.log(err);
        done();
    }

})


function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function sendOTP(userid, email) {
    try {


        let mail = {
            userid: userid,
            email: email

        }
        console.log("Email is added to Job Queue " + userid);
        OtpQueue.add(mail);
        return true;
    } catch (err) {
        console.log(err);
        return false;

    }

}


module.exports = {
    sendOTP
}
