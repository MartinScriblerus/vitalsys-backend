const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const cors = require('cors');
const fs = require('fs');
const folderPath = './utils';
const app = express();
const router = express.Router();
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
// I edited the link below from original, which didn't make any sense (in case this breaks)
const beckett = require('./utils/scraper.js')


const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.DEBUG_PORT}`); // 8626


const config = {
    name: 'sample-express-app',
    port: process.env.DEBUG_PORT,
    host: process.env.DEBUG_HOST,
};

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'))
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", `${process.env.DEBUG_PORT}`); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(ExpressAPILogMiddleware(logger, { request: true }));


app.get('/', (req, res) => {
    res.status(200).send('yo look at this');
});

app.get('/storyscrapes', (req, res) => {
    console.log(req.body)
    res.send({ express: 'Helloooo From Express' });
    return res.json(storyscrape);
  });
  
  app.get('/storyscrapes/:storyscrape', (req, res) => {
    console.log(req.body)
    var chosen = req.params.character;
    console.log(chosen);
  
   for (var i = 0; i < storyscrapes.length; i++) {
      if (chosen === storyscrapes[i].routeName) {
        return res.json(storyscrapes[i]);
      }
    }
    return res.json(false);
  });
  
  app.post('/storyscrapes', (req, res) => {
    console.log(req.body);
    res.send(
      `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
  });
  
app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});