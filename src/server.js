/**
 *
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

const users = [{
  id: 1,
  login: 'admin',
  password: 'changethispassword'
},
{
  id: 2,
  login: 'yohan'
}]

const chats = [{
  id: '123',
  users: [2]
}]

app.post('/api/join', (req, res) => {
  var found = false
  console.log(req.body)
  chats.forEach(function (chat) {
    if (chat.id === req.body.chatID) {
      found = true
      res.json({
        message: 'Chat joined',
        error: 0
      })
    }
  })
  if (!found) {
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

app.get('/api/test', (req, res) => {
  console.log('ce console.log est appelé au bon moment')
  res.json([
    {
      title: 'truc',
      content: 'machin'
    }, {
      title: 'truc2',
      content: 'machin2'
    }
  ])
})

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

app.post('/api/sendmessage', (req, res) => {
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

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
