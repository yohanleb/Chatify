const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('src/db.json')
const db = low(adapter)

module.exports = {
  getChat: function (params) {
    return db
      .get('chats')
      .find({ id: parseInt(params.chatID) })
      .value()
  },
  getUser: function (params) {
    return db
      .get('users')
      .find({
        name: params.name,
        chatID: parseInt(params.chatID)
      })
      .value()
  },
  getUsers: function (params) {
    return db
      .get('users')
      .chain()
      .filter({ chatID: params.chatID })
      .sortBy('name')
      .value()
  },
  getMessages: function (params) {
    return db
      .get('messages')
      .chain()
      .filter({ chatID: params.chatID })
      .sortBy('send_time')
      .value()
  },
  getLastChatID: function () {
    return db
      .get('chats')
      .chain()
      .filter()
      .sortBy('id')
      .value()
      .slice(-1).pop().id + 1
  },
  createUser: function (params) {
    return db.get('users')
      .push(params.user)
      .write()
  },
  createChat: function (params) {
    return db.get('chats')
      .push(params)
      .write()
  },
  createMessage: function (params) {
    return db.get('messages')
      .push(params)
      .write()
  }
}
