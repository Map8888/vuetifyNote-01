<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="$a.setting.showPage"
      transition="dialog-bottom-transition"
      fullscreen
    >


      <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="$a.setting.showPage = !$a.setting.showPage"
          ></v-btn>

          <v-toolbar-title>Settings</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
              text="Save"
              variant="text"
              @click="$a.setting.showPage = !$a.setting.showPage"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-sheet elevation="6">
            <v-tabs
              bg-color="grey-darken-2"
              next-icon="mdi-arrow-right-bold-box-outline"
              prev-icon="mdi-arrow-left-bold-box-outline"
              show-arrows
            >
              <!-- <v-tab text="Tab1" @click="currentTab = 'Tab1'"></v-tab> -->
              <v-tab
                v-for="i in 30"
                :key="i"
                :text="`Tab${i}`"
                @click="currentTab = 'Tab'+i"
              ></v-tab>
            </v-tabs>
          </v-sheet>
          
          <v-card v-show="currentTab == 'Tab1'">
            <v-textarea label="Label" variant="outlined" v-model="message"></v-textarea>
            <v-btn variant="outlined"  @click="getInit()">Init</v-btn>
            <pre v-if="initRes !== null">{{initRes}}</pre>
            <v-btn variant="outlined"  @click="getHealth()">Healt</v-btn>
            <pre v-if="healthResult !== null">{{healthResult}}</pre>

            <v-switch
                @change="this.$a.ap.theme = (darkMode == true ? 'dark' : 'light')"
                v-model="darkMode"
                :label="`Dark Mode: ${darkMode.toString()}`"
                hide-details
                inset
              ></v-switch>
            <!-- this.$a.ap.theme = (this.$a.ap.theme === 'dark' ? 'light' : 'dark') -->
          </v-card>
        

      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentTab : 'Tab1',
        message : "" ,
        healthResult : null ,
        initRes : null ,
        darkMode : true ,
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
  }
</script>