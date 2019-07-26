export default function(sequelize, Sequelize) {

  const Comment = sequelize.define('comment',
    {
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      articleId: {
        type:Sequelize.INTEGER,
        allowNull: false
      },
      pid: {
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    });

  Comment.associate = function(models) {
    Comment.belongsTo(models.user, { as: 'author', foreignKey: 'authorId', targetKey: 'id' });
  };

  return Comment;
};
