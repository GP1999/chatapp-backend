const radis=require('redis');
const radisClient=radis.createClient();

radisClient.on("error",function(err){
    console.log(err);
});
radisClient.on("connect",function(){
    console.log("Connnection established to radis");
});


module.exports=radisClient;