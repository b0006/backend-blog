module.exports = function(sequelize, Sequelize) {

  const KeyWord = sequelize.define('keyWord',
    {
      title: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
      },
      description: {
        type:Sequelize.TEXT
      },
      img: {
        type:Sequelize.STRING
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    });

  KeyWord.associate = function(models) {
    KeyWord.belongsToMany(models.article, { through: models.articleKeyWord });
  };

  return KeyWord;
};
