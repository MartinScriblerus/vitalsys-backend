const express = require('express');
const bodyParser = require('body-parser');
const rita = require('rita');
const fs = require('fs');

const cors = require('cors');
const app = express();
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');


const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is 5000`); // 8626


const config = {
  name: 'sample-express-app',
  port: 5000,
  host: process.env.DEBUG_HOST,
};

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'))
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${process.env.DEBUG_PORT}`); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(ExpressAPILogMiddleware(logger, { request: true }));

const getParadiseLost = () =>{
  try {
    return fs.readFileSync('./paradise-lost.txt', 'utf8');
  } catch (err) {
    return err;
  }
}


app.get('/', (req, res) => {
    let sentencesBeckett = getParadiseLost();

    beckett = sentencesBeckett.replace(/\\n/g, '');

    rita.tokenize(beckett);
    rita.splitSentences(beckett);
    let rm = new rita.RiMarkov(5);
    rm.loadText(beckett);
    sentencesBeckett = rm.generateSentences(1);
    console.log(sentencesBeckett);
    res.send().status(200);

});



app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});