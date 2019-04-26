const apiBase = 'https://cloud-api.yandex.net';
const { yandex } = require('../config');
const fetch = require('node-fetch');

class YandexDisk {
  static async getResource (url, method = 'GET') {
    const res = await fetch(apiBase + url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `OAuth ${yandex.token}`
      }
    });
    return res.json();
  };

  static async setResource(url, content, method = 'POST', absolutePath = false) {
    let body = content === null ? null : JSON.stringify(content);
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `OAuth ${yandex.token}`
    };

    if (method === 'PUT') {
      headers = {
        'Authorization': `OAuth ${yandex.token}`
      };
      body = content;
    }

    const urlPath = absolutePath ? url : apiBase + url;

    const res = await fetch(urlPath, {
      method,
      body,
      headers
    });

    return method === 'PUT' ? res : res.json();
  };

  static async getData() {
    return this.getResource('/v1/disk/')
      .then(res => {
        return res;
      }).catch(err => {
        return err;
      });
  }

  static async getUrlForUpload(path) {
    return this.getResource(`/v1/disk/resources/upload?path=${path}`)
      .then(res => {
        return res;
      }).catch(err => {
        return err;
      });
  }
}

module.exports = YandexDisk;
