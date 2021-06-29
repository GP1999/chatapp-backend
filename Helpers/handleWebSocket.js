const io=require('socket.io');

let websocket;s

function initialiseSocket(server){
    websocket=io(server);
    websocket.on('connection',(socket)=>{
        console.log('new user connected '+socket.id);
    });
    websocket.on('disconnect',(socket)=>{
        console.log('User disconnected '+socket.id);
    })
    websocket.on('error',()=>{
        console.log("something Went Wrong");
    })

}

module.exports={websocket}