<template>
  <v-layout row>
    <v-flex>
      <v-app-bar class="teal lighten-1" app clipped-right dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ chatName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>Chat ID : {{ chatID }}</v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" app>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Chat Users
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="(user, i) in users" :key="i">
            <v-icon>account_circle</v-icon>
            <v-spacer></v-spacer>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <div class="pa-2">
            <v-btn block color="#e74c3c" dark @click="logout()">
              <v-icon dark left>exit_to_app</v-icon>Logout
            </v-btn>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer fixed temporary></v-navigation-drawer>
        <v-list v-chat-scroll="{always: false, smooth: true}">
            <!-- La liste des messages -->
            <v-list-item
              class="message"
              v-for="(message, i) in messages"
              :key="i"
              :class="[(message.username == session.user.name) ? 'own' : 'user']"
            >
              <!-- Message -->
              <v-list-item-content>
                <v-list-item-title class="username" v-text="message.username"></v-list-item-title>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on" class="content" v-text="message.content"></v-list-item>
                  </template>
                  <span v-text="$options.filters.format_date(message.send_time)"></span>
                </v-tooltip>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      <div class="typebox">
        <input type="text" placeholder="Send a message..." v-on:keyup.enter="sendMessage" v-model="content">
        <v-btn class="btnMsg teal lighten-1" dark @click="sendMessage()">
          <v-icon dark left>message</v-icon>Send
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import io from 'socket.io-client'

export default {
  data () {
    return {
      drawer: null,
      errorMessage: '',
      chatName: this.$cookie.get('chatName'),
      chatID: this.$cookie.get('chatID'),
      users: this.getUsers(),
      messages: this.getMessages(),
      socket: io.connect(this.$apiURL, { query: 'chatID=' + this.$cookie.get('chatID') }),
      content: ''
    }
  },
  methods: {
    async getMessages () {
      try {
        const response = await this.axios.post(
          this.$apiURL + '/api/messages/',
          {
            chatID: this.$cookie.get('chatID'),
            username: this.$cookie.get('username')
          }
        )
        if (response.data.error === 0) {
          this.messages = response.data.messages
          this.session = response.data.session
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        this.snackbar = true
        this.errorMessage = this.$genericErrorMessage
      }
    },
    async getUsers () {
      try {
        const response = await this.axios.post(this.$apiURL + '/api/users/', {
          chatID: this.$cookie.get('chatID')
        })
        if (response.data.error === 0) {
          this.users = response.data.users
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        this.snackbar = true
        this.errorMessage = this.$genericErrorMessage
      }
    },
    async sendMessage () {
      this.socket.emit('chat-message', {
        chatID: this.$cookie.get('chatID'),
        username: this.$cookie.get('username'),
        content: this.content,
        send_time: new Date()
      })

      this.content = ''
    },
    logout () {
      this.$cookie.delete('username')
      this.$cookie.delete('chatID')
      this.$cookie.delete('chatName')
      this.$router.push({
        name: 'index'
      })
    }
  },
  mounted () {
    document.documentElement.style.overflow = 'hidden'
    this.socket.on('message', (data) => {
      this.messages.push(data)
    })
  }
}
</script>

<style>
.typebox{
  position: relative;
  border: 0.25rem solid #00796B;
  border-radius:10px;
  justify-content: center;
  margin : 1rem;
  display: flex;
  align-items: center;
  height: 5rem;
}

.typebox input[type=text]{
  position: relative;
  height: 3.5rem;
  left: 1rem;
  width: 100%;
  outline: none;
  font-size: 1.25rem;
}
.message.user {
  padding-right: 50%;
}
.message.own {
  text-align: right;
  padding-left: 50%;
}
.message.own .content {
  background-color: #80CBC4;
}
.username {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.btnMsg {
  margin-right: 1rem;
}
.content {
  background-color:#f1f0f0;
  border-radius: 10px;
  word-wrap: break-word;
}
.v-list{
  height:calc(100vh - 11rem);
  overflow-y:auto
}
</style>
