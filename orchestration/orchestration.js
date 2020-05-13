
require("dotenv").config();
const { exec } = require("child_process");
const express = require("express");
const app = express();
const axios = require("axios").default;
const port = process.env.PORT;

app.get("/kill/:botNum", (request, response) => {
    //get bot number from path variable
    let botNum = request.params.botNum;
    axios.get(`http://${process.env.HOST + botNum}/`).then(message => {
        //execute shell command to stop the appropriate litbot
        exec(`docker-compose stop litbot${botNum}`, (error) => {
            if (error) {
                response.send(`Unable to run command to stop: ${error.message}`).status(500);
                return;
            }
            else {
                response.send(`Litbot${botNum}'s last words: ${message.data}`).status(200);
            }
        });
    });
});

app.get("/heal/:botNum", (request, response) => {
    //get bot number from path variable
    let botNum = request.params.botNum;
    exec(`docker-compose start litbot${botNum}`, (error) => {
        if (error) {
            response.send(`Unable to run command to start: ${error.message}`).status(500);
        }
        else {
            response.send(`Successfully started: Listbot${botNum}`).status(200);
        }
    });
});

app.listen(port, () => { console.log("Listening on port:" + port) });