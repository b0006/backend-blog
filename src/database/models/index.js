import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import { development, production } from '../config';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const config = env === 'production' ? production : development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

let db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js'); // eslint-disable-line
  })
  .forEach(function(file) {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
