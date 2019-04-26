module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        title: 'Admin',
        admin: true
      },
      {
        title: 'Guest',
        admin: false
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('roles', null, {}),
      queryInterface.sequelize.query('ALTER TABLE roles AUTO_INCREMENT = 1')
    ]);

  }
};
