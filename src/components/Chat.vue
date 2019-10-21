<template>
  <div>
    <v-layout row>
      <v-flex>
        <div class="chat-container">
          <v-list>
            <v-list-item-group>
              <v-list-item
                class="message"
                v-for="(message, i) in messages"
                :key="i"
                :class="{own: message.username == session.user.name}"
              >
                <v-list-item-content>
                  <v-list-item-title class="username" v-text="message.username"></v-list-item-title>
                  <v-list-item class="content" v-text="message.content"></v-list-item>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
        <div class="typer">
          <input type="text" placeholder="Write a message" v-model="content" v-on:keyup.enter="sendMessage()"/>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: this.getMessages(),
      chatID: null,
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
        console.log('error :', err)
      }
    }
  }
}
</script>

<style>
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer input[type="text"] {
  position: absolute;
  left: 1.5rem;
  padding: 1rem;
  width: 90%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  background-color: #f2f2f2;
}
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightskyblue;
}
.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  word-wrap: break-word;
}
</style>
