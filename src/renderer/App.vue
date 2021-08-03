<template>
  <div class="app">
    <router-view></router-view>
<!--    <navigator style="position: absolute; bottom: 0"></navigator>-->
  </div>
</template>

<script lang=ts>
import { defineComponent } from 'vue'
import Navigator from '/@/components/HomeNavigator.vue'

export default defineComponent({
  components: {
    Navigator
  }
})
</script>

<style>
</style>
