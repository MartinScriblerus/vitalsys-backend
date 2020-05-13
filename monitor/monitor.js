require("dotenv").config({path: "./.env"});
let express = require("express");
let app = express();
let axios = require("axios").default;
let port = process.env.MONITOR_PORT;

const checkBotClusterHealth = async (botNum) =>{
    try{
        return await axios.get(`http://${process.env.CLUSTER_IP}0${botNum}/`);
    }
    catch{
        return Promise.resolve("");
    }
}

const healBot = async (botNum) =>{
    try{
        return await axios.get(`http://${process.env.EC2_IP}:5555/heal/0${botNum}/`);
    }
    catch{
        return Promise.resolve("");
    }
}

app.get("/health", async (request, response)=>{
    try{
        let health = [];
        for(let i = 1; i <= 7; i++){
            let botHealth = await checkBotClusterHealth(i);
            health.push(botHealth.data ? true : false);
            //if bot is dead send orchestration request to heal it
            if(!botHealth.data){
                //try to heal bot
                let healResponse = await healBot(i);
                //if unable to heal bot send server side error status
                if(!healResponse) response.send(`Failed to start Litbot0${i}`).status(500);
            }
        }
        response.send(health).status(200);
    }
    catch(err){
        response.send(err).status(500);
    }
});



app.listen(port, ()=>{console.log("Listening on port: " + port)});