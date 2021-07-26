<template >
  <div class="app">
    <router-view> </router-view>
  </div>
</template>

<script lang=ts>
import { defineComponent } from 'vue'
import Navigator from '/@/components/HomeNavigator.vue'

export default defineComponent({
  components: {
    Navigator
  },
})
</script>

<style>
</style>
