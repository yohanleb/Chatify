<template>
  <v-app id="inspire">
    <v-content>
      <v-snackbar
        v-model="snackbar"
        :top="true"
        color="error"
      >
        {{ errorMessage }}
        <v-btn
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>

      <!-- JOIN A CHAT FORM  -->
      <v-container class="fill-height" fluid v-if="!changeForm">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Join</v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href target="_blank" v-on="on" @click="setChangeForm">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <span>Create a new chat</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Username"
                    name="username"
                    v-model="username"
                    prepend-icon="person"
                    type="text"
                    :rules="usernameRules">
                  </v-text-field>

                  <v-text-field
                    id="chatID"
                    label="Chat ID"
                    name="chatID"
                    v-model="chatID"
                    prepend-icon="lock"
                    type="text"
                    :rules="chatIDRules">
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="join()" :disabled="!valid">Join</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- CREATE A CHAT FORM  -->
      <v-container class="fill-height" fluid v-if="changeForm">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Create</v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href target="_blank" v-on="on" @click="setChangeForm">
                      <v-icon>chat</v-icon>
                    </v-btn>
                  </template>
                  <span>Join a chat</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field label="Username" name="username" prepend-icon="person" type="text"></v-text-field>

                  <v-text-field
                    id="chatName"
                    label="Chat Name"
                    name="chatName"
                    prepend-icon="edit"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="create(username, 123)">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    changeForm: false,
    snackbar: false,
    errorMessage: '',
    id: '',
    description: '',
    connected: false,
    todos: [],
    url: 'http://localhost:4000', // 'http://localhost:4000'
    chatID: '',
    username: '',
    valid: false,
    usernameRules: [
      v => !!v || 'Username is required'
    ],
    chatIDRules: [
      v => !!v || 'chatID is required'
    ]
  }),
  methods: {
    async join () {
      try {
        // console.log(chatID)
        const response = await this.axios.post(
          this.url + '/api/join/',
          {
            chatID: this.chatID,
            username: this.username
          }
        )
        this.connected = true
        if (response.data.error === 0) {
          this.$router.replace({ name: 'chat', params: { chatID: this.chatID } })
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        console.log('error :', err)
      }
    },
    setChangeForm () {
      this.changeForm = !this.changeForm
    }
    /*
    async login () {
      // connecter l'utilisateur
      try {
        const response = await this.axios.post(this.url + '/api/login', {
          login: 'admin',
          password: 'changethispassword'
        })
        this.connected = true
        console.log('response is:', response.data.message)
      } catch (err) {
        console.log('error :', err)
      }
    },
    async logout () {
      try {
        const response = await this.axios.get(this.url + '/api/logout')
        this.connected = false
        console.log('response is:', response.data.message)
      } catch (err) {
        console.log('error :', err)
      }
    },
    */
  }
}
</script>