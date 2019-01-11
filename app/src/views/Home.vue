<template>
  <div class="home">
    <div id="nav">
      Last 10 lines from text file
    </div>
    <div v-for="line in lastLines" :key="line">
      {{line}}
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'home',
  computed: {
    ...mapGetters({
      lastLines:  'lastLines'
    }),
  }
}
</script>
