import cache from 'memory-cache';
import fs from 'fs';
import path from 'path';

import models from '../../database/models';

import { yandex, saveFiles } from '../../config';
import YandexDiskfrom from '../../yandex/Yandex';

import { translit } from '../../utils/translit';
import { md5 } from '../../utils/hash';

import { articleConstants } from '../../constants';

const appDir = path.dirname(require.main.filename);

class Article {
  static async getList(req, res) {
    const cacheArticle = cache.get(articleConstants.CACHE_ARTICLE);
    let articles = null;
    if (cacheArticle) {
      APP.log.info('Articles get from cache');
      articles = cacheArticle;
    } else {
      APP.log.info('Articles get from DB');

      try {
        articles = await models.article.findAll({
          order: [['updatedAt', 'DESC']]
        });
      } catch (e) {
        res.send({
          status: false,
          error: JSON.stringify(e)
        });
        return false;
      }

      articles = articles.map(item => item.dataValues);
      updateCookieArticle(articles);
    }

    res.send({
      status: true,
      articles
    });
  }

  static async getArticleByValue(req, res) {
    const articleValue = req.params.value;
    let article = null;

    const cacheArticles = cache.get(articleConstants.CACHE_ARTICLE);
    if (cacheArticles) {
      article = cacheArticles.find(item => item.value === articleValue);
    }

    if (!article) {
      let articleDb = null;
      try {
        articleDb = await models.article.findOne({
          where: {
            value: articleValue
          }
        });
      } catch (e) {
        APP.log.error(e);
        res.send({
          status: false,
          error: JSON.stringify(e)
        });
        return false;
      }

      if (!articleDb) {
        res.send({
          status: false,
          error: 'Article is\'t exist'
        });
        return false;
      }

      article = articleDb.dataValues;
    }

    res.send({
      status: true,
      article
    });
  }

  static async addArticle(req, res) {
    const { title, content, mainImageBase64, keyWords } = req.body;
    try {
      const [article, created] = await models.article.findOrCreate({
        where: {
          title: title,
          value: translit(title)
        },
        defaults: {
          title: title,
          text: content,
          value: translit(title),
          image: saveMainImageArticle(mainImageBase64, title)
        }
      });
      if (created) {
        updateCookieArticle(article.dataValues);
        let keyWordsId = keyWords.map((id)=>parseInt(id));
        keyWordsId.map((id)=>{
          models.articleKeyWord.create({
            articleId:article.dataValues.id,
            keyWordId:id
          })
            .catch((err) => console.log(err));
        });
        res.send({
          status: true,
          createStatus: true
        });
      } else {
        res.send({
          status: false,
          error: 'Article already exist'
        });
      }
    } catch (e) {
      res.send({
        status: false,
        error: e.toString()
      });
      return false;
    }
  }

  static async deleteArticle(req, res) {
    const { articleId } = req.body;

    try {
      const removed = await models.article.destroy({
        where: {
          id: articleId
        }
      });

      const status = !!removed;

      const newArticles = updateCookieArticle(null, articleId);
      res.send({
        status: status,
        articles: newArticles
      });

    } catch (e) {
      res.send({
        status: false,
        error: e.toString()
      });
    }
  }

  static saveImage(req, res) {
    const file = req.files.upload;

    const formatFile = file.mimetype.split('/')[1];
    const newFileName = `article_${md5(file.name + new Date())}.${formatFile}`;

    const urlFile = `/images/${newFileName}`;
    const absolutePathFile = `${appDir}${urlFile}`;

    const domain = process.env.NODE_ENV === 'development'
      ? articleConstants.apiBase
      : '';

    fs.writeFile(absolutePathFile, file.data, (err) => {
      if (err) throw err;
      APP.log.info('Saved!');

      const uriFile = domain + urlFile;

      if (saveFiles === 'yandex') {
        saveImageYandexDisk(uriFile, newFileName, absolutePathFile).then(link => {
          res.send({
            status: true,
            name: file.name,
            url: link
          });
        }).catch(err => {
          res.send({
            status: false,
            error: err.toString()
          });
        });
      } else {
        res.send({
          status: true,
          name: file.name,
          url: uriFile
        });
      }
    });
  }

  static async getSortList(req, res){
    const { page, count, sortType, dateFrom, dateTo } = req.body;
    let articles = null;
    try {
      articles = await sortToPageAndCount(page, count);
    } catch (e) {
      res.send({
        status: false,
        error: JSON.stringify(e)
      });
      return false;
    }
    if (sortType === 'date') {
      if (!dateTo){
        try {
          articles = await sortToDate(dateFrom);
        } catch (e) {
          res.send({
            status: false,
            error: JSON.stringify(e)
          });
          return false;
        }
      } if (dateFrom && dateTo) {
        try {
          articles = await sortToPeriod(dateFrom,dateTo);
        } catch (e) {
          res.send({
            status: false,
            error: JSON.stringify(e)
          });
          return false;
        }
      } if (!dateFrom) {
        res.send({
          status: false,
          error:'не выбрана начальная дата'
        });
      }

    } else {
      res.send({
        status: false,
        error:'не какая сортировка не применяеться'
      });
    }
    articles = articles.map(item => item.dataValues);
    res.send({
      status: true,
      articles,
      countPage: Math.ceil(articles.length / count)
    });
  }

  static async updateArticle(req, res){
    const articleId = req.params.id;
    const { title, image, text, keyWordsId } = req.body;
    let article = null;
    try {
      article = await models.article.findById(articleId);
      article.title = title;
      article.image = image;
      article.text = text;
      article.getKeyWords()
        .then(keyWords=>{
          if (keyWordsId) {
            let keyWordsIdInt = keyWordsId.map((id) => parseInt(id));
            keyWords.map(item => {
              item.articleKeyWord.destroy();
            }); 
            keyWordsIdInt.map((id) => {
              models.articleKeyWord.create({
                articleId:articleId,
                keyWordId:id
              });
            });
          }
          res.send({
            status: true,
            post: 'Update artcile',
            article: article,
            keyWords: keyWords
          });
        })
        .catch((err)=>console.log(err));
      article.save();
    } catch (e) {
      res.send({
        status: false,
        error: JSON.stringify(e)
      });
      return false;
    }
  }
}

function updateCookieArticle(newArticle = null, articleId = null) {
  if (newArticle) {
    if (newArticle instanceof Array) {
      cache.put(articleConstants.CACHE_ARTICLE, newArticle);
    } else {
      const cacheArticle = cache.get(articleConstants.CACHE_ARTICLE);
      if (cacheArticle) {
        cacheArticle.unshift(newArticle);
        cache.put(articleConstants.CACHE_ARTICLE, cacheArticle);
      }
    }
  } else {
    const cacheArticle = cache.get(articleConstants.CACHE_ARTICLE);
    const removeIndex = cacheArticle.findIndex(item => item.id === articleId);

    let newArray = cacheArticle.slice();
    newArray.splice(removeIndex, 1);
    cache.put(articleConstants.CACHE_ARTICLE, newArray);

    return newArray;
  }
}

function clearCookieArticle() {
  cache.del(articleConstants.CACHE_ARTICLE);
}

function sortToDate(date){
  APP.log.info(date);
  APP.log.info('Articles get from DB');
  const articles = models.article.findAll({
    where: { $and:[{ createdAt:{ $gte:`${date} 00:00:00` } },
      { createdAt:{ $lte:`${date} 23:59:59` } }] }
  });
  return articles;
}
function sortToPeriod(dateFrom, dateTo){
  APP.log.info(dateFrom, dateTo);
  APP.log.info('Articles get from DB');
  const articles = models.article.findAll({
    where: { $and:[{ createdAt:{ $gte:`${dateFrom} 00:00:00` } },
      { createdAt:{ $lte:`${dateTo} 23:59:59` } }] }
  });
  return articles;
}

function saveMainImageArticle(fileBase64, articleName) {
  const urlFile = `/images/article_main_${md5(articleName + new Date())}`;

  const base64 = fileBase64.split(';base64,').pop();

  fs.writeFile(appDir + urlFile, base64, { encoding: 'base64' }, (err) => {
    if (err) throw err;
    //APP.log.info('Saved!');
  });

  return urlFile;
}

function sortToPageAndCount(page, count){
  let pageStart = null;
  if (parseInt(page) === 1){
    pageStart = 0;
  } else {
    pageStart = page * count;
  }
  return models.article.findAll({ offset: pageStart, limit: count });
}

async function saveImageYandexDisk(uriFile, newFileName, absolutePathFile) {
  let result = null;

  // сначала запрашиваем разрешение на операцию
  try {
    result = await YandexDisk.getResource(
      `/v1/disk/resources/upload?url=${uriFile}&path=/fullstack_blog/articles/${newFileName}`
    );
  } catch (e) {
    APP.log.error(e);
    return false;
  }
  if (result.method === 'PUT') {
    // загружаем файл на яндекс диск
    try {
      await YandexDisk.setResource(result.href, fs.createReadStream(absolutePathFile), 'PUT', true);
    } catch (e) {
      APP.log.error(e);
      return false;
    }

    // получаем ссылку файла на яндекс диске
    let yandexFile = null;
    try {
      yandexFile = await YandexDisk.getResource(`/v1/disk/resources/download?path=${yandex.articlePath}/${newFileName}`);
    } catch (e) {
      APP.log.error(e);
      return false;
    }

    // удаляем файл на текущем сервере
    fs.unlink(absolutePathFile, (err) => {
      if (err) APP.log.error(err);
      APP.log.info(`successfully deleted ${absolutePathFile}`);
    });

    if (yandexFile) {
      return yandexFile.href;
    } else {
      return false;
    }
  } else {
    APP.log.info(result);
    return false;
  }
}

module.exports = Article;
