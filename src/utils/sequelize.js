const models = require('../database/models');

const getItems = (dbName) => {
  return models[dbName].findAll()
    .then(result => {
      return result.map(item => item.dataValues);
    })
    .catch(err => {
      APP.log.error(err);
      return false;
    });
};

module.exports = {
  getItems
};
