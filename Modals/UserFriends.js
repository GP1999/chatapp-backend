const { ObjectID } = require('mongodb');

const ChatApp = require('../Databases/MongoDb.js').db('ChatApp');

class UserFriends {

    constructor(userid) {
        this.id = userid;
    }
    createDocumetForUser() {

        const Userdata = {
            _id : this.id,
            friends: [],
            blocked: [],
            friend_request:[],
        }
        try {
            ChatApp.collection('UserFriends').insertOne(Userdata).then((result, error) => {
                if (error) {
                    console.log(error);
                }
            });
        } catch (err) {
            console.log(err);
        }

    }
    //It will return Promise which will resolve and give frinds List
    getUsersFriends(){

        return ChatApp.collection('UserFriends').findOne({
            _id:ObjectID(this.id)
        },{projection:{friends:1}});
    }
    //It will fetch the details of Friends of User
    getUsersFriendsDetails(ids){    
        return ChatApp.collection('UserFriends').find({_id:{$in:ids}},{password:0}).toArray();
    }
    addFriend(friendId){

        return ChatApp.collection('UserFriends').updateOne({_id:ObjectID(this.id)},{$push:{friends:friendId}});
    }
}


module.exports=UserFriends