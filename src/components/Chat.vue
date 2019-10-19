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
      <v-toolbar-title>Chat de user login</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark right="true">
            <v-icon dark left>mdi-exit-to-app</v-icon>Déconnexion
          </v-btn>
    </v-app-bar>

      <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
          <v-list-item @click.stop="left = !left">
            <v-list-item-content>
              <v-list-item-title>Jean</v-list-item-title>
              <v-list-item-title>Patrick</v-list-item-title>
              <v-list-item-title>Eleonore</v-list-item-title>
              <v-list-item-title>Lucie</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer v-model="left" fixed temporary></v-navigation-drawer>

      <div class="chat-container">
        <v-list>
          <v-list-item-group>
            <!-- La liste des messages -->
            <v-list-item
              class="message"
              v-for="(message, i) in messages"
              :key="i"
              :class="{own: message.type == 'own'}"
            >
              <!-- Message -->
              <v-list-item-content>
                <v-list-item-title class="username" v-text="message.username"></v-list-item-title>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on" class="content" v-text="message.content"></v-list-item>
                  </template>
                  <span v-text="message.heure"></span>
                </v-tooltip>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <div class="typeBox">
        <input type="text" placeholder="message..." />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      messages: [
        {
          username: 'Jean',
          content: 'message de Jean',
          type: 'user',
          heure: '10:00'
        },
        {
          username: 'Bertrand',
          content: 'message de Bertrand',
          type: 'user',
          heure: '12:00'
        },
        {
          username: 'Patrick',
          content: 'message de Patrick',
          type: 'user',
          heure: '12:01'
        },
        {
          username: 'Moi',
          content: 'message de Moi',
          type: 'own',
          heure: '12:02'
        }
      ],
      users: [
        {
          name: 'Jean'
        },
        {
          name: 'Patrick'
        }
      ],
      drawer: null
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
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  background-color: #f2f2f2;
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
