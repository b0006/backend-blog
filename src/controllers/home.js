const path = require('path');
const appDir = path.dirname(require.main.filename);

class Home {
  static home(req, res) {
    res.end('Blog');
  }

  static getImage(req, res) {
    res.sendFile(appDir + req.originalUrl);
  }
}

module.exports = Home;
