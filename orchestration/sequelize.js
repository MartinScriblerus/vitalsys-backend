import Sequelize from 'sequelize';
import MessageModel from './models/Message';


const sequelize = new Sequelize('user', 'test', processs.env.DBPASSWORD, {
  host: process.env.DBHOST,
  dialect: 'postgres',
});

const Message = MessageModel(sequelize, Sequelize)

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Message db and Message table have been created');
});

module.exports = { Message };