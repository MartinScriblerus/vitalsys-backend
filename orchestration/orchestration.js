
require("dotenv").config({ path: "./.env" });
const { exec } = require("child_process");
const express = require("express");
const app = express();
const axios = require("axios").default;
const port = process.env.ORCHESTRATION_PORT;

//kill a bot process
app.get("/kill/:botNum", (request, response) => {
    //get bot number from path variable
    let botNum = request.params.botNum;
    axios.get(`http://${process.env.CLUSTER_IP + botNum}/`).then(message => {
        //execute shell command to stop the appropriate litbot
        exec(`docker-compose kill litbot${botNum}`, (error) => {
            if (error) {
                response.send(`Unable to run command to stop: Litbot${numBot}`).status(500);
                return;
            }
            else {
                response.send(`Litbot${botNum}'s last words: ${message.data}`).status(200);
            }
        });
    });
});

//check if bot is down
const checkBotClusterHealth = async (botNum) => {
    try {
        return await axios.get(`http://${process.env.CLUSTER_IP}0${botNum}/`);
    }
    catch{
        return Promise.resolve("");
    }
}

//heal bot if it's down
const healBot = async (botNum) => {
    try {
        return await exec(`docker-compose start litbot0${botNum}`, (error) => {
            if (error) {
                return `Unable to run command to start: Litbot0${botNum}`;
            }
            else {
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
            let botHealth = await checkBotClusterHealth(i);
            health.push(botHealth.data ? true : false);
            //if bot is dead send orchestration request to heal it
            if (!botHealth.data) {
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

app.listen(port, () => { console.log("Listening on port:" + port) });