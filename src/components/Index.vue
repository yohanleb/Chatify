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
              <v-toolbar class="teal lighten-1" dark flat>
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
                <v-form v-model="validJoin">
                  <v-text-field
                    label="Username"
                    name="username"
                    v-model="username"
                    prepend-icon="person"
                    type="text"
                    v-on:keyup.enter="join"
                    :rules="usernameRules"
                    color="teal lighten-1">
                  </v-text-field>

                  <v-text-field
                    id="chatID"
                    label="Chat ID"
                    name="chatID"
                    v-model="chatID"
                    prepend-icon="lock"
                    type="text"
                    v-on:keyup.enter="join"
                    :rules="chatIDRules"
                    color="teal lighten-1">
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn class="teal lighten-1 white--text" @click="join()" :disabled="!validJoin">Join</v-btn>
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
              <v-toolbar class="teal lighten-1" dark flat>
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
                <v-form v-model="validCreate">
                  <v-text-field
                  id="username"
                  label="Username"
                  name="username"
                  v-model="username"
                  prepend-icon="person"
                  type="text"
                  v-on:keyup.enter="create"
                  :rules="usernameRules"
                  color="teal lighten-1">
                  ></v-text-field>

                  <v-text-field
                    id="chatName"
                    label="Chat Name"
                    name="chatName"
                    v-model="chatName"
                    prepend-icon="edit"
                    type="text"
                    v-on:keyup.enter="create"
                    :rules="chatNameRules"
                    color="teal lighten-1">
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn class="teal lighten-1 white--text" @click="create()" :disabled="!validCreate">Create</v-btn>
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
    chatID: '',
    chatName: '',
    username: '',
    validJoin: false,
    validCreate: false,
    usernameRules: [
      v => !!v || 'Username is required'
    ],
    chatIDRules: [
      v => !!v || 'Chat ID is required'
    ],
    chatNameRules: [
      v => !!v || 'Chat Name is required'
    ]
  }),
  methods: {
    async join () {
      try {
        const response = await this.axios.post(
          this.$apiURL + '/api/join/',
          {
            chatID: this.chatID,
            username: this.username
          }
        )

        if (response.data.error === 0) {
          this.$cookie.set('username', this.username, 1)
          this.$cookie.set('chatID', this.chatID, 1)
          this.$cookie.set('chatName', response.data.chatName, 1)
          this.$router.push({
            name: 'chat',
            params: {
              chatID: this.chatID
            }
          })
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        this.snackbar = true
        this.errorMessage = this.$genericErrorMessage
      }
    },
    async create () {
      try {
        const response = await this.axios.post(
          this.$apiURL + '/api/create/',
          {
            username: this.username,
            chatName: this.chatName
          }
        )

        if (response.data.error === 0) {
          this.chatID = response.data.chatID
          this.$cookie.set('username', this.username, 1)
          this.$cookie.set('chatID', this.chatID, 1)
          this.$cookie.set('chatName', this.chatName, 1)
          this.$router.push({
            name: 'chat',
            params: {
              chatID: this.chatID
            }
          })
        } else {
          this.snackbar = true
          this.errorMessage = response.data.message
        }
      } catch (err) {
        this.snackbar = true
        this.errorMessage = this.$genericErrorMessage
      }
    },
    setChangeForm () {
      this.changeForm = !this.changeForm
    }
  }
}
</script>
