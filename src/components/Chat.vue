<template>
  <v-layout row>
    <v-flex>
  <v-app-bar
      app
      clipped-right
      color="blue-grey"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ chatName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark right="true" @click="logout()">
        <v-icon dark left>mdi-exit-to-app</v-icon>
        Logout
      </v-btn>
  </v-app-bar>

      <v-navigation-drawer v-model="drawer" app>
        <v-list dense disabled>
          <v-list-item @click.stop="left = !left" v-for="(user, i) in users" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer v-model="left" fixed temporary></v-navigation-drawer>

      <div class="chat-container">
        <v-list disabled>
          <v-list-item-group>
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
                  <span v-text="message.send_time"></span>
                </v-tooltip>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <div class="typeBox">
        <input type="text" placeholder="Write a message" v-model="content" v-on:keyup.enter="sendMessage()"/>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      drawer: null,
      left: false,
      right: false,
      errorMessage: '',
      messages: this.getMessages(),
      users: this.getUsers(),
      chatID: null,
      chatName: this.$cookie.get('chatName'),
      username: null,
      content: ''
    }
  },
  methods: {
    async getMessages () {
      this.chatID = this.$cookie.get('chatID')
      this.username = this.$cookie.get('username')

      try {
        const response = await this.axios.post(
          this.$apiURL + '/api/messages/',
          {
            chatID: this.chatID,
            username: this.username
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
        const response = await this.axios.post(
          this.$apiURL + '/api/users/',
          {
            chatID: this.chatID
          }
        )
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
      try {
        var message = {
          chatID: this.session.user.chatID,
          username: this.session.user.name,
          content: this.content
        }
        this.content = ''
        const response = await this.axios.post(
          this.$apiURL + '/api/sendmessage/',
          {
            message: message
          }
        )
        if (response.data.error === 0) {
          this.messages.push(message)
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        this.snackbar = true
        this.errorMessage = this.$genericErrorMessage
      }
    },
    logout () {
      this.$cookie.delete('username')
      this.$cookie.delete('chatID')
      this.$cookie.delete('chatName')
      this.$router.push({
        name: 'index'
      })
    }
  }
}
</script>

<style>
.typeBox {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
}
.typeBox input[type="text"] {
  position: absolute;
  left: 1.5rem;
  padding: 1rem;
  background-color: transparent;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  background-color: #f2f2f2;
}
.message.user{
  padding-right: 50%;
}
.message.own {
  text-align: right;
  padding-left: 50%;
}
.message.own .content {
  background-color: lightskyblue;
}
.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content {
  background-color: lightgreen;
  border-radius: 10px;
  word-wrap: break-word;
}
</style>
