module.exports = {
  Query: {
    users: (parent, args, { db }, info) => db.user.findAll(),
    user: (parent, { id }, { db }, info) => db.user.findByPk(id) 
  }
}
