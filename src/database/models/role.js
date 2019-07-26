export default function(sequelize, Sequelize) {

  const Role = sequelize.define('role',
    {
      title: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false
    }
  );

  return Role;
};
