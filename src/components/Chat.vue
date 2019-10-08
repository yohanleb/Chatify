<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >

        <p> CHAT </p>

        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'chat',

  data: () => ({
    url: 'http://localhost:4000' // 'http://localhost:4000'
  })
}
</script>
