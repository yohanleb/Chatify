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
                :class="{own: message.type == 'own'}"
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
          <input type="text" placeholder="message..." />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: [
        { username: 'Jean', content: 'message de Jean', type: 'user' },
        { username: 'Bertrand', content: 'message de Bertrand', type: 'user' },
        { username: 'Patrick', content: 'message de Patrick', type: 'user' },
        { username: 'Moi', content: 'message de Moi', type: 'own' }
      ]
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
