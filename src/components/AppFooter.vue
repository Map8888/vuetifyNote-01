<template>
  <v-footer  app>

    <v-infinite-scroll
    direction="horizontal"
  >
<!--     <a
      v-for="item in items"
      :key="item.title"
      :href="item.href"
      :title="item.title"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
    >
      <v-icon
        :icon="item.icon"
        size="36"
      />
    </a> -->
    <v-icon
      icon="mdi-home"
      size="36"
      @click="$router.push('/')"
    />
    <v-icon
      icon="mdi-reorder-horizontal"
      size="36"
      @click="$a.setting.showPage = !$a.setting.showPage"
    />
    <v-icon
      icon="mdi-notebook"
      size="36"
      @click="$router.push('/notes')"
    />
    <v-icon
      icon="mdi-alpha-t-circle-outline"
      size="36"
      @click="$router.push('/ts')"
    />
    <v-icon
      icon="mdi-alpha-t-circle-outline"
      size="36"
      @click="$router.push('/ts2')"
    />
    <v-icon
      icon="mdi-alpha-t-circle-outline"
      size="36"
      @click="$router.push('/ts3')"
    />
    <v-icon
      icon="mdi-map-marker"
      size="36"
      @click="$router.push('/locationView')"
    />
    
    <template v-slot:loading>
      <!-- Custom spinner -->
      <!-- <v-progress-circular
        indeterminate
        color="primary"
        size="30"
        width="5"
      ></v-progress-circular> -->
    </template>

</v-infinite-scroll>

  </v-footer>
</template>

<script>
  export default {
    data() {
      return {
        items : [
            {
              title: 'Vuetify Documentation',
              icon: `$vuetify`,
              href: '/index',
            },
            {
              title: 'Vuetify Support',
              icon: 'mdi-lan-connect',
              href: 'https://support.vuetifyjs.com/',
            },    
          ],
      }
    },
    methods : {
      doIt(){
        this.$a.setting.showPage = !this.$a.setting.showPage
      }
    }
  }

</script>

<style scoped>
  .v-footer {
    padding : 5px;
  }
    
  .social-link .v-icon {
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
    text-decoration: none;
    transition: 0.2s ease-in-out;
  }

  .social-link .v-icon:hover {
    color: rgba(25, 118, 210, 1);
  }
</style>