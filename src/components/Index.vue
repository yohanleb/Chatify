<template>
  <v-app id="inspire">
    <v-content>
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
                <v-form>
                  <v-text-field label="Username" name="username" prepend-icon="person" type="text"></v-text-field>

                  <v-text-field
                    id="chatID"
                    label="Chat ID"
                    name="chatID"
                    prepend-icon="lock"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="join(username, 12)">Join</v-btn>
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
                <v-btn color="primary" @click="create(username, 12)">Create</v-btn>
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
    id: '',
    description: '',
    connected: false,
    todos: [],
    url: 'http://localhost:4000', // 'http://localhost:4000'
    chatID: '',
    username: ''
  }),
  methods: {
    async join (username, chatID) {
      this.$router.replace({ name: 'chat', params: { chatID: chatID } })
      /*
      try {
        const response = await this.axios.get(
          this.url + '/api/join/' + chatId,
          {
            username: username
          }
        )
        this.connected = true
        console.log('response is:', response.data.message)
      } catch (err) {
        console.log('error :', err)
      }
      */
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
