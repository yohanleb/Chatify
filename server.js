/**
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 * puis node server.js
 * exemple complet à l'adresse https://github.com/Musinux/first-vue-app
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const app = express()
const shortid = require('shortid')

// Socket server
const http = require('http').Server(app)
const io = require('socket.io')(http)
http.listen(4444, '')

var DBhelper = require('./src/db_helper.js')

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
  origin: 'http://127.0.0.1:8080'
}))

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

io.on('connection', (socket) => {
  // socket.join(socket.handshake.query['chatID'])
  socket.join(socket.handshake.query.chatID)
  console.log('A user is connected')
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

io.on('connection', (socket) => {
  socket.on('chat-message', (data) => {
    DBhelper.createMessage({
      id: shortid.generate(),
      chatID: parseInt(data.chatID),
      username: data.username,
      content: data.content,
      send_time: data.send_time
    })

    io.to(data.chatID).emit('message', {
      content: data.content,
      username: data.username,
      send_time: data.send_time
    })
  })
})

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

  messages.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date)
  })

  res.json({
    error: 0,
    session: { user: user },
    messages: messages.reverse()
  })
})

app.post('/api/users', (req, res) => {
  var users = DBhelper.getUsers({
    chatID: parseInt(req.body.chatID)
  })

  res.json({
    error: 0,
    users: users
  })
})

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
