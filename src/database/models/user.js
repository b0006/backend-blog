export default function(sequelize, Sequelize) {

  const User = sequelize.define('user',
    {
      login: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      role: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        allowNull: false,
        defaultValue: 2
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  );

  return User;
};
