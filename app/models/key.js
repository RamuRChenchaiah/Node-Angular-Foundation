/* Key model
------------*/
module.exports = function(sequelize, Sequelize) {
  var Key = sequelize.define('Keys', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }
  },{
    associate: function(models) {
      Key.belongsTo(models.Users);
    }
  });
  return Key;
};
