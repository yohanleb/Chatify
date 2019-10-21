/**
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 * puis node server.js
 * exemple complet à l'adresse https://github.com/Musinux/first-vue-app
 */
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const app = express()
const io = require('socket.io')(http)
const shortid = require('shortid')

var DBhelper = require('./db_helper.js')

app.use(session({
  secret: 'nnfkvnkjdnvnqdvfnmdsjnvm', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))

app.post('/api/join', (req, res) => {
  var chat = DBhelper.getChat({
    chatID: parseInt(req.body.chatID)
  })

  if (chat) {
    var user = DBhelper.getUser({
      name: req.body.username,
      chatID: parseInt(req.body.chatID)
    })

    if (!user) {
      user = {
        id: shortid.generate(),
        chatID: parseInt(req.body.chatID),
        name: req.body.username
      }

      DBhelper.createUser({
        user: user
      })
    }

    res.json({
      error: 0,
      session: { user: user },
      chatName: chat.chatName
    })
  } else {
    res.json({
      message: 'Chat not found, try again !',
      error: 1
    })
  }

  /*
  io.on('connection', (socket) => {
    io.on('connected', (user) => {
      // this.users[socket.id] = user
      // io.emit('users', this.users)
      for (var chat in chats) {
        if (chat.id === req.body.chatID) {
          console.log('FOUND')
          res.json({
            message: 'joined',
            error: 0
          })
        }
      }
      res.json({
        message: 'chat not exist',
        error: 1
      })
    })
  })
  */
})

app.post('/api/create', (req, res) => {
  // Getting last id + 1
  var chatID = DBhelper.getLastChatID()

  DBhelper.createChat({
    id: chatID,
    chatName: req.body.chatName
  })

  var user = {
    id: shortid.generate(),
    chatID: chatID,
    name: req.body.username
  }

  DBhelper.createUser({
    user: user
  })

  res.json({
    error: 0,
    chatID: chatID
  })
})

app.post('/api/messages', (req, res) => {
  var user = DBhelper.getUser({
    name: req.body.username,
    chatID: parseInt(req.body.chatID)
  })

  var messages = DBhelper.getMessages({
    chatID: parseInt(req.body.chatID)
  })

  res.json({
    error: 0,
    session: { user: user },
    messages: messages
  })
})

app.post('/api/sendmessage', (req, res) => {
  DBhelper.createMessage({
    id: shortid.generate(),
    chatID: req.body.message.chatID,
    username: req.body.message.username,
    content: req.body.message.content,
    send_time: new Date()
  })

  res.json({
    error: 0
  })

  /*
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  } else {
    io.on('connection', (socket) => {
      socket.on('message', (message) => {
        io.emit('message', message)
      })
    })
  }
  */
})

/*
app.post('/api/login', (req, res) => {
  console.log('req.body', req.body)
  console.log('req.query', req.query)
  if (!req.session.userId) {
    const user = users.find(u => u.login === req.body.login && u.password === req.body.password)
    if (!user) {
      // gérez le cas où on n'a pas trouvé d'utilisateur correspondant
      console.log('user not found')
    } else {
      // connect the user
      req.session.userId = 1000 // connect the user, and change the id
      res.json({
        message: 'connected'
      })
      console.log('Welcome !')
    }
  } else {
    res.status(401)
    res.json({
      message: 'you are already connected'
    })
  }
})
*/

app.get('/api/logout', (req, res) => {
  if (!req.session.userId) {
    res.status(401)
    res.json({
      message: 'you are already disconnected'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'you are now disconnected'
    })
  }
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
