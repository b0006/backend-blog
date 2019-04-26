const models = require('../../database/models');

function getTree(comments, pid = 0) {
  let commentItem = {};
  let tree = [];

  comments.map(item => {
    if (item.pid === pid) {
      commentItem = {
        id: item.id,
        authorName: item.author.login,
        authorId: item.author.id,
        authorLogin: item.author.login,
        authorAvatar: item.author.avatar,
        date: item.createdAt,
        content: item.content,
        children: []
      };
      commentItem.children = getTree(comments, item.id);
      tree.push(commentItem);
    }
  });

  return tree;
}

class Comment {
  static async getList(req, res) {
    const { id } = req.query;

    let comments = null;
    try {
      comments = await models.comment.findAll({
        where: {
          articleId: id
        },
        include:
          {
            model: models.user,
            as: 'author',
            attributes: ['id', 'login', 'avatar', 'role.ts']
          }
      });
    } catch (e) {
      res.send({
        status: false,
        error: e.toString()
      });
      return false;
    }

    comments = comments.map(comment => {
      return {
        ...comment.dataValues,
        author: comment.dataValues.author.dataValues
      };
    });

    let tree = getTree(comments);

    res.send({
      status: true,
      commentList: tree
    });
  }

  static async addComment(req, res) {
    const { content, pid, articleId } = req.body;

    res.send({
      status: true,
      massage: 'Comment add successfully'
    });
  }
}

module.exports = Comment;
