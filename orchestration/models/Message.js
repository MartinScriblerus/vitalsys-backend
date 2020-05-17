module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define("Message", 
  {
      idPL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
      messagePL: {
        type: DataTypes.STRING,
        allowNull: false
        },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
        },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
        },    
      },
    
  );

  return Message;
};