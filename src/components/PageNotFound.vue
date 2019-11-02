<template>
  <v-container fill-height style="height: calc(100vh - 58px);">
    <v-layout align-center>
      <v-flex text-center>
        <h1 class="display-2 primary--text">Whoops, 404</h1>
        <p>The page you were looking for does not exist</p>
        <router-link to="/" tag="v-btn">
          <v-btn outlined color="primary" flat value="feed">
            <span>Home</span>
          </v-btn>
        </router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'pagenotfound',

  data: () => ({
    url: 'http://localhost:4000' // 'http://localhost:4000'
  })
}
</script>
