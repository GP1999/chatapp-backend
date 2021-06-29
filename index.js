const express=require('express');
const http=require('http');
const cors=require('cors');
const cookiParser=require('cookie-parser');
const app=express();
const mongodb=require('./Databases/MongoDb.js');
const radisClient=require('./Databases/radis.js');
const compression=require('compression');
const routes=require('./Services/index.js');
const server=http.createServer(app);
const io=require('socket.io')(server,{
    cors:{
        origin:'*'
    }
});
//Applying middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiParser());
app.use(compression());

//applying routes
app.use('/api/v1/',routes);



//apply socket handlers and define different event handlres
io.on('connection',(socket)=>{
    console.log(`user with socket id ${socket.id} is connected`);
})
io.on('disconnect',(socket)=>{

    console.log(`User with socketid ${socket.id} is disconnected`);
})



//start server and perform cleaning and closing of other connection 
//on closing server
const PORT=process.env.PORT |8080;

server.listen(PORT,()=>{
    console.log(`server listning on Port ${PORT}`)
});
function cleanup(){
    server.close(async()=>{
        try{
        console.log("\nclosing Connection ...");
        await mongodb.close();
        console.log("==>MongoDB Connection Closed.")
        radisClient.end(true);
        console.log("==>Radis connection closed")
           process.exit();
        }catch(err){
            console.log(err);
            console.log("Forcefully exiting server");
            process.exit();
        }
    })

}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);