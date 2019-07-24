module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        login: 'b0006',
        password: '$2a$08$rihPLaMJOMgVNBYp.ihcAe.0Hzg4zGIDqlLtOMnfKbWbYb.W.um0W', //13820003
        role: 1,
        email: 'akasikov@yandex.ru',
        active: true
      },
      {
        login: 'b0007',
        password: '$2a$08$rihPLaMJOMgVNBYp.ihcAe.0Hzg4zGIDqlLtOMnfKbWbYb.W.um0W', //13820003
        role: 2,
        email: 'qsefthuken@gmail.com',
        active: true
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('users', null, {}),
      queryInterface.sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1')
    ]);

  }
};
