const crypto = require('crypto');
const radishClient = require('../../Databases/radis');

function TwoUserChat(io, socket) {

    socket.on('send_message', (msg) => {

        console.log(`New Message from ${
            socket.id
        } `, msg);
        // get recepient socket id
        const receiverKey = "socket:user:" + msg.userId;
        radishClient.get(receiverKey, (err, receiverSocketId) => {

            if (err) {
                
                  socket.to(socket.id).emit('invalid_recepient','No receiver Present');
                console.log(err);
            }else if(receiverSocketId){
                socket.to(receiverSocketId).emit('new_message',msg);
            }else{
                socket.to(socket.id).emit('invalid_recepient','No receiver Present');


            }
        })
    })
}

module.exports = {
    TwoUserChat
}
