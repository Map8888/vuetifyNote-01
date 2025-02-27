<template>
  <v-app>
    <router-view />
    
    <SettingPage/>
    <Spd />
  </v-app>
</template>

<style>
  * {
      scrollbar-width: thin;
  }
</style>

<script>
  import SettingPage from './components/SettingPage.vue'
  import Spd from './components/Spd.vue'
  import { useTheme } from 'vuetify'

  export default {
    setup(){
      // const nt = noteStore();
      const theme = useTheme()
      return {
        theme,
      //   nt,
      }
    },
    components: {
      SettingPage ,
    },
    data() {
      return {

      }
    },
    beforeCreate(){
      this.theme.global.name.value = this.$a.ap.theme
    },
    watch :{
      '$a.ap.theme' : function(nv,ov){
        this.theme.global.name.value = nv
      }
    }
  }
</script>
