module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", 
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
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
        },
      updatedAt: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
        },    
      },
    
  );

  return Message;
};