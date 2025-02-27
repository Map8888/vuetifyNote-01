<template>
https://vuetifyjs.com/en/features/icon-fonts/#built-in-aliases
<br>
https://pictogrammers.github.io/@mdi/font/3.6.95/
<br>



  <AppFooter />
</template>
<script>
import AppFooter from '../components/AppFooter.vue'
export default {
  components: {
    AppFooter
  },
  data() {
    return {
      message : "" ,
      healthResult : null ,
      initRes : null ,
    };
  },
  methods: {
      async getHealth() {
        const result = await this.$a.ax({
          method: 'GET',
          url: '/health'
        })
        if (result.success) {
          this.healthResult = result.data
        }
      },
      async getInit() {
        const result = await this.$a.ax({
          method: 'POST',
          url: '/init' ,
          data : this.message
        })
        if (result.success) {
          this.initRes = result.data
          // console.log(result.data)
        }
      },
    },
  watch:{
    '$a.axInf':function(nv,ov){
      console.log(nv,ov)
    }
    // 'message':function(nv,ov){
    //  console.log(JSON.parse(nv))
    // },
  },
}
</script>