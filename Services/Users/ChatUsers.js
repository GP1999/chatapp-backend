const ChatApp = require('../../Databases/MongoDb.js').db('ChatApp');
const UserFriends = require('../../Modals/UserFriends.js');


function getUsersFriendsList(req, res, next) {
    try {
        const id = req.query.id;

        const UserFriend = new UserFriends(id);
        UserFriend.getUsersFriends().then((result, err) => {
            if (err) {
                console.log(err);
                res.status(500).send({err: "Internal Server Error"})
            } else { // console.log(result);
                UserFriend.getUsersFriendsDetails(result.friends).then((result) => { // console.log(result);
                    res.status(200).send(result);
                })

            }

        }).catch((err) => {
            console.log(err)
            res.status(500).send({err: "Internal Server Error"})

        });


    } catch (err) {
        console.log(err);
        res.status(500).send({err: "internal server error"})
    }

}

// function addInFriendList(userId,friendId){
function addInFriendList(req, res, next) {
    const {userId, friendId} = req.body;
    const UserFriend = new UserFriends(userId);
    UserFriend.addFriend(friendId).then((result) => {
        console.log(result);
        res.status(200).send();
    }).catch((err) => {
        console.log(err);
        res.status(500).send();
    })
}


module.exports = {
    getUsersFriendsList,
    addInFriendList
}
