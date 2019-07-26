export default function(sequelize, Sequelize) {

  const ArticleKeyWord = sequelize.define('articleKeyWord',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  );
    
  return ArticleKeyWord;
};
  