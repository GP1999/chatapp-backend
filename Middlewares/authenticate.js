const jwt=require('jsonwebtoken');
async function authenticate(req, res, next) {
    try {
        const token = req.body.token;
        if (token) {
            // verify token.If token is invalid then it will generate error
            // Invalide token-expired token,not signed token ,etc.
            jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
                if (err) {
                    res.status(403).send({err: "Invalid token.Please Login"});

                } else {
                    next();
                }
            })

        } else {
            res.status(403).send({err: "Invalid token.Please login"})
        }

    } catch (err) {
        res.status(400).send({err: "Bad request"})
    }
}
module.exports={
    authenticate
}