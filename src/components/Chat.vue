<template>
  <v-layout row>
    <v-flex style="position: relative;">
      <v-app-bar app clipped-right color="blue-grey" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ chatName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" dark @click="logout()">
          <v-icon dark left>exit_to_app</v-icon>Logout
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" app>
        <v-list>
          <v-list-item v-for="(user, i) in users" :key="i">
            <v-icon>account_circle</v-icon>
            <v-spacer></v-spacer>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer fixed temporary></v-navigation-drawer>

      <div class="chat-container">
        <v-list>
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
        </v-list>
      </div>
      <div class="typebox">
        <input type="text" placeholder="Ecrire un message..." v-on:keyup.enter="sendMessage" v-model="content">
        <v-btn class="btnMsg" color="blue darken-3" dark @click="sendMessage()">
          <v-icon dark left>message</v-icon>Send
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      drawer: null,
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
        const response = await this.axios.post(this.$apiURL + '/api/users/', {
          chatID: this.chatID
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
      try {
        var message = {
          chatID: this.session.user.chatID,
          username: this.session.user.name,
          content: this.content,
          send_time: new Date()
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
  .typebox{
    
    position: relative;
    border-top: 0.25rem solid #607d8b;
    justify-content: center;
    display: flex;
    align-items: center;
    height: 5rem;
  }

  .typebox input[type=text]{
    position: relative;
    height: 3.5rem;
    left: 2.5rem;
    width: 75rem;
    outline: none;
    font-size: 1.25rem;
  }
.chat-container {
  margin: 1rem;
  overflow-y: auto;
  background-color: #f2f2f2;
}
.message.user {
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
.btnMsg {
  margin-right: 1rem;
}
.chat-container .content {
  background-color: lightgreen;
  border-radius: 10px;
  word-wrap: break-word;
}
</style>
