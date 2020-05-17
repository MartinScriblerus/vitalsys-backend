require("dotenv").config({ path: "./.env" });
const { exec } = require("child_process");
const express = require("express");
const app = express();
const axios = require("axios").default;
app.set('port', process.env.ORCHESTRATION_PORT || 5555);
const Sequelize = require("sequelize");
const MessageModel = require("./models/Message");

let healing = false;

const db = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'postgres',
});

const Message = MessageModel(db, Sequelize);

//get bot text
const getBotText = async (botNum) => {
    try {
        return await axios.get(`http://${process.env.CLUSTER_IP + botNum}/`);
    }
    catch {
        return Promise.resolve("");
    }
}

//persist bot text
const persistBotText = async (message) => {
    //check if message is empty
    if(message){
        try {
            return await Message.create({ messagePL: message });
        }
        catch{
            throw new Exception("Unable to persist message.");
        }
    }
}


//kill a bot
const killBot = async (botNum) => {
    //execute shell command to stop the appropriate litbot
    let message = await getBotText(botNum);
    if (message.data) {
        let killResponse = await exec(`docker-compose kill litbot${botNum}`);
        if (killResponse.stdout) {
            return `Litbot0${botNum}'s last words: ${message.data}`;
        }
        else {
            return `Unable to kill Litbot0${botNum}.`;
        }
    }
    else {
        return "";
    }
}

//endpoint to kill a a bot
app.get("/kill/:botNum", async (request, response) => {
    //get bot number from path variable
    let botNum = request.params.botNum;
    let message = await killBot(botNum);
    persistBotText(message);
    if (!message.indexOf("Unable")) {
        response.send(message).status(200);
    }
    else {
        response.send(message).status(500);
    }
});

//kill random number of bots
const daemonMode = async () => {
    //random number of bots
    let randBotAmount = Math.floor(Math.random() * 7) + 1;
    //bot messages
    let messages = [];
    //no duplicate set of bots to destroy
    let destroyedBots = [];
    for (let i = 0; i < randBotAmount; i++) {
        //random bot number
        let randBotNum = Math.floor(Math.random() * 7) + 1;
        //make sure bots aren't double killed
        while (destroyedBots.includes(randBotNum)) {
            randBotNum = Math.floor(Math.random() * 7) + 1;
        }
        //get message from bot
        let message = await killBot(`0${randBotNum}`);
        //persist bot text in db
        await persistBotText(message);
        //add message to return list
        messages.push(message);
        //add bot to no duplicate set
        destroyedBots.push(randBotNum);
    }
    return messages;
}

//endpoint for killing random bots
app.get("/daemon", async (request, response) => {
    let messages = await daemonMode();
    response.send(messages).status(200);
});

//heal bot if it's down
const healBot = async (botNum) => {
    healing = true;
    try {
        return await exec(`docker-compose start litbot0${botNum}`, (error) => {
            if (error) {
                return `Unable to run command to start: Litbot0${botNum}`;
            }
            else {
                healing = false;
                return `Successfully started: Litbot0${botNum}`;
            }
        });
    }
    catch{
        return Promise.resolve("");
    }
}

//health check for the bot cluster
app.get("/health", async (request, response) => {
    try {
        let health = [];
        for (let i = 1; i <= 7; i++) {
            let botHealth = await getBotText(`0${i}`);
            health.push(botHealth.data ? true : false);
            //if bot is dead send orchestration request to heal it
            if (!botHealth.data && !healing) {
                //try to heal bot
                let healResponse = await healBot(i);
                //if unable to heal bot send server side error status
                if (typeof healResponse !== "object") response.send(`Failed to start Litbot0${i}`).status(500);
            }
        }
        response.send(health).status(200);
    }
    catch (err) {
        response.send(err).status(500);
    }
});

app.get("/messages/:session", async (request, response)=>{
    try{
        const session = request.params.session;
        const messages = await Message.findAll({
            attributes:["messagePL"],
            where:{
                createdAt:{
                    [Sequelize.Op.gt]: new Date(session)
                }
            }
        });
        const formattedMessages = messages.map((item)=>{return new String(item.messagePL)});
        response.send(formattedMessages).status(200);
    }
    catch{
        response.send("Couldn't retrieve messages from the database.").status(500);
    }
});

db.sync().then(() => {
    console.log('Message db and Message table have been created');
});

app.listen(app.get('port'), () => { console.log("Listening on port:" + app.get('port')) });