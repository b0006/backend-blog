const models = require('../../database/models');
const { md5 } = require('../../utils/hash');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

class KeyWord {
  static async addKeyWord(req, res){
    const { title, description, iconBase64 } = req.body;
    try {
      const [keyword, created] = await models.keyWord.findOrCreate({
        where: { title: title },
        defaults: {
          title: title,
          description: description,
          img: saveMainImageKeyWords(iconBase64, title)
        }
      });
      if (created) {
        res.send({
          status: true,
          massage: 'Created KeyWord',
          keyword: keyword
        });
      } else {
        res.send({
          status: false,
          massage: 'not'
        });
      }
    }
    catch (e){
      console.log(e);
      res.send({
        status: false,
        massage: `${e.toString()}`
      });
      return false;
    }
  }
  static async getKeyWords(req, res){
    try {
      const keyWords = await models.keyWord.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.send({
        status: true,
        keyWordList: keyWords
      });
    }
    catch (e){
      console.log(e);
      res.send({
        status: false,
        massage: `${e.toString()}`
      });
      return false;
    }
  }

  static async deleteKeyWord(req, res) {
    const { keyWordId } = req.body;
    try {
      const removed = await models.keyWord.destroy({
        where:{ id: keyWordId }
      });
      res.send({
        status: true,
        massage: 'destroy keyWord'
      });
    } catch (e) {
      res.send({
        status: false,
        error: `${e.toString()}`
      });
    }
  }

  static async updateKeyWord(req, res) {
    const keyWordId = req.params.id;
    const { title, description, img } = req.body;
    let keyWord = null;
    try {
      keyWord = await models.keyWord.findById(keyWordId);
      keyWord.title = title;
      keyWord.description = description;
      keyWord.img = img;
      keyWord.save();
      res.send({
        status: true,
        massage: 'Update KeyWord'
      });
    } catch (e) {
      res.send({
        status: false,
        massage: `${e.toString()}`
      });
    }
  }
}
function saveMainImageKeyWords(fileBase64, keyName) {
  const urlFile = `/images/keyWords/${keyName}_${md5(keyName + new Date())}`;

  const base64 = fileBase64.split(';base64,').pop();

  fs.writeFile(appDir + urlFile, base64, { encoding: 'base64' }, (err) => {
    if (err) throw err;
    APP.log.info('Saved!');
  });

  return urlFile;
}
module.exports = KeyWord;