const express=require('express');
const http=require('http');
const cors=require('cors');
const cookiParser=require('cookie-parser');
const app=express();
const mongodb=require('./Databases/MongoDb.js');
const radisClient=require('./Databases/radis.js');
const compression=require('compression');
const routes=require('./Services/index.js');

//Applying middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiParser());
app.use(compression());

//applying routes
app.use('/api/v1/',routes);






//start server and perform cleaning and closing of other connection 
//on closing server
const PORT=process.env.PORT |8080;
const server=http.createServer(app);
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