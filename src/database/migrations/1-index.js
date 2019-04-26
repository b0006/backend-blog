'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "articles", deps: []
 * createTable "keyWords", deps: []
 * createTable "roles", deps: []
 * createTable "users", deps: []
 * createTable "articleKeyWords", deps: [articles, keyWords]
 *
 **/

var info = {
  'revision': 1,
  'name': 'index',
  'created': '2019-03-11T03:37:23.341Z',
  'comment': ''
};

var migrationCommands = [{
  fn: 'createTable',
  params: [
    'articles',
    {
      'id': {
        'type': Sequelize.INTEGER,
        'field': 'id',
        'autoIncrement': true,
        'primaryKey': true,
        'allowNull': false
      },
      'title': {
        'type': Sequelize.STRING,
        'field': 'title',
        'allowNull': false,
        'notEmpty': true
      },
      'value': {
        'type': Sequelize.STRING,
        'field': 'value',
        'allowNull': false
      },
      'text': {
        'type': Sequelize.TEXT,
        'field': 'text',
        'allowNull': false
      },
      'image': {
        'type': Sequelize.STRING,
        'field': 'image',
        'allowNull': false
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {
      'charset': 'utf8'
    }
  ]
},
{
  fn: 'createTable',
  params: [
    'keyWords',
    {
      'id': {
        'type': Sequelize.INTEGER,
        'field': 'id',
        'autoIncrement': true,
        'primaryKey': true,
        'allowNull': false
      },
      'title': {
        'type': Sequelize.STRING,
        'field': 'title',
        'allowNull': false,
        'notEmpty': true
      },
      'description': {
        'type': Sequelize.TEXT,
        'field': 'description'
      },
      'img': {
        'type': Sequelize.STRING,
        'field': 'img'
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {
      'charset': 'utf8'
    }
  ]
},
{
  fn: 'createTable',
  params: [
    'roles',
    {
      'id': {
        'type': Sequelize.INTEGER,
        'field': 'id',
        'autoIncrement': true,
        'primaryKey': true,
        'allowNull': false
      },
      'title': {
        'type': Sequelize.STRING(50),
        'field': 'title',
        'allowNull': false
      },
      'admin': {
        'type': Sequelize.BOOLEAN,
        'field': 'admin',
        'defaultValue': false,
        'allowNull': false
      }
    },
    {
      'charset': 'utf8'
    }
  ]
},
{
  fn: 'createTable',
  params: [
    'users',
    {
      'id': {
        'type': Sequelize.INTEGER,
        'field': 'id',
        'autoIncrement': true,
        'primaryKey': true,
        'allowNull': false
      },
      'login': {
        'type': Sequelize.STRING,
        'field': 'login',
        'allowNull': false,
        'notEmpty': true
      },
      'password': {
        'type': Sequelize.STRING,
        'field': 'password',
        'allowNull': false,
        'notEmpty': true
      },
      'role': {
        'type': Sequelize.INTEGER,
        'field': 'role.ts',
        'defaultValue': 2,
        'allowNull': false,
        'notEmpty': true
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {
      'charset': 'utf8'
    }
  ]
},
{
  fn: 'createTable',
  params: [
    'articleKeyWords',
    {
      'id': {
        'type': Sequelize.INTEGER,
        'field': 'id',
        'autoIncrement': true,
        'primaryKey': true
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      },
      'articleId': {
        'type': Sequelize.INTEGER,
        'field': 'articleId',
        'onUpdate': 'CASCADE',
        'onDelete': 'CASCADE',
        'references': {
          'model': 'articles',
          'key': 'id'
        },
        'unique': 'articleKeyWords_keyWordId_articleId_unique'
      },
      'keyWordId': {
        'type': Sequelize.INTEGER,
        'field': 'keyWordId',
        'onUpdate': 'CASCADE',
        'onDelete': 'CASCADE',
        'references': {
          'model': 'keyWords',
          'key': 'id'
        },
        'unique': 'articleKeyWords_keyWordId_articleId_unique'
      }
    },
    {
      'charset': 'utf8'
    }
  ]
}
];

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize)
  {
    var index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length)
        {
          let command = migrationCommands[index];
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else
          resolve();
      }
      next();
    });
  },
  info: info
};
