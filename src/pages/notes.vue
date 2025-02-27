<template>
  <!-- Twitter Timeline with Infinite Scroll -->
    <v-infinite-scroll>
      <template v-for="(item, index) in nt.noteList" :key="item">
        <NoteCard :listId="index"/>
        
        
      </template>
      <template v-slot:loading>
<!--         <v-btn v-show="!finished" @click="handleManualLoad" size="x-large" density="text"  icon="mdi-page-next-outline"></v-btn>
        <v-btn v-show="finished" size="x-large" density="text"  icon="mdi-not-equal-variant"></v-btn> -->
        <v-btn @click="handleManualLoad" :disabled="finished" :append-icon="finished ? 'mdi-not-equal-variant' : 'mdi-page-next-outline'" variant="text">
  {{ loading ? 'Loading...' : ( finished ? 'Finished' : 'Load More') }}
</v-btn>
      </template>

<!--       <template v-for="(item, index) in nt.noteList">
          <NoteCard :listId="index"/>
      </template> -->

    </v-infinite-scroll>

    <v-navigation-drawer
      v-model="ShowLocationDisplay"
      location="bottom"
      persistent
    >
      <ShowLocation v-if="ShowLocationDisplay" :str="nt.currentShowLocation" />
      <v-btn @click="ShowLocationDisplay = false" style="width: 100%;" color="primary">Close</v-btn>
    </v-navigation-drawer>
    <!--  -->
    <v-navigation-drawer app
      v-model="ShowPicsDisplay"
      location="bottom"
      persistent
      temporary
      >
      <FilesShow v-if="ShowPicsDisplay" :str="nt.currentShowPics" />
      <v-btn @click="ShowPicsDisplay = false" style="width: 100%;" color="primary">Close</v-btn>
    </v-navigation-drawer>
    <!--  -->

    <v-navigation-drawer
      v-model="showSetQuery"
      location="bottom"
      temporary
    >

    <v-container fluid>
        <p>Situ</p>
      <v-radio-group  v-model="doneQ"  inline>
        <v-radio  label="Not"  value="0"></v-radio>
        <v-radio  label="Done"  value="1"></v-radio>
        <v-radio  label="All"  value="null"></v-radio>
      </v-radio-group>

      <v-select v-if="nt.topicsList != null"
        v-model="topicsQ"
        :items="nt.topicsList"
        item-title="topic"
        item-value="id"
        variant="underlined"
        multiple
        persistent-hint
      ></v-select>

        <p>Orde</p>
      <v-radio-group  v-model="orderQ"  inline>
        <v-radio  label="DESC"  value="DESC"></v-radio>
        <v-radio  label="ASC"  value="ASC"></v-radio>
      </v-radio-group>

        <p>Limit</p>
      <v-radio-group  v-model="limitQ"  inline>
        <v-radio  label="10"  value="10"></v-radio>
        <v-radio  label="20"  value="20"></v-radio>
        <v-radio  label="30"  value="30"></v-radio>
      </v-radio-group>
    </v-container>

    <v-btn @click="srchAgain()" style="width: 100%;" color="primary">SearhAgain</v-btn>
    </v-navigation-drawer>

    <v-footer app>
      
      <v-text-field  fixed
        prepend-inner-icon="mdi-map-marker"
        label="Append inner"
        variant="underlined"
        hide-details
        v-model="searchQ"
      >
        
        <template v-slot:append>
          <v-badge color="warning"  location="top start" :content="Object.keys(nt.noteList).length">
            <v-icon @click="showSetQuery = !showSetQuery" icon="mdi-dots-vertical-circle-outline"></v-icon>
          </v-badge>
        </template>

      </v-text-field>

    </v-footer>

    

</template>

<script>
  import { noteStore } from '../stores/notestore'
  import NoteCard from '../components/notes/NoteCard.vue'
  import ShowLocation from '../components/notes/ShowLocation.vue'
  import FilesShow from '../components/notes/FilesShow.vue'
  export default {
    setup(){
      const nt = noteStore();
      return {
        nt,
      }
    },
    components: {
      NoteCard ,
      ShowLocation,
      FilesShow,
    },
    data() {
      return {
      // items: Array.from({ length: 50 }, (k, v) => v + 1),
        searchQ : "" ,
        limitQ : '10' ,
        topicsQ : [] ,
        doneQ : '0' ,
        orderQ : 'DESC' ,
        showSetQuery : false ,
        // nt.noteList: [],
        loading: false,
        finished: false,
        page: 1,
        size: 10,
        totalItems: 0 ,
        // nt.topicsList: null ,
        debounceTimeout : null ,
        typeWaiting : 300 ,
        ShowLocationDisplay : false ,
        ShowPicsDisplay : false ,
        NoteEditFormDisplay : false ,
      };
    },
    mounted(){
      
      this.getTopics()
    },
    methods: {
      // load ({ done }) {
      //   setTimeout(() => {
      //     this.items.push(...Array.from({ length: 10 }, (k, v) => v + this.items.at(-1) + 1))

      //     done('ok')
      //   }, 1000)
      // },
      qGen(){
        var q = `/crud/note/nt?page=${this.page}&size=`+parseInt(this.limitQ)
        q += '&order='+(this.orderQ == 'DESC' ? '-' : '')+'id'
        q += this.doneQ !== 'null' ? '&filter=done,eq,'+this.doneQ : ''
        q += this.topicsQ.length > 0 ? '&filter=topic_id,in,'+this.topicsQ.join("|") : '' 
        q += this.searchQ.length > 0 ? '&filter=note,cs,'+this.searchQ : ''
        return q
      },
      async getTopics() {
          const result = await this.$a.ax({
            method: 'GET',
            url: `/crud/note/topic_list`
          });
          const mv = []
          if (result.success) {
            // console.log(result.data.data)
            this.nt.topicsList = result.data.data
            // console.log(this.nt.topicsList.find(item => item.value === this.nt.noteList[listId].topic_id))
            // for (var i = 0; i < result.data.data.length; i++) {
            //   mv[result.data.data[i].id] = { label : result.data.data[i].topic , value : result.data.data[i].id }
            // }
          }
          // this.nt.topicsList = mv
          
          this.handleManualLoad()
      },
      async handleManualLoad() {
        if (this.loading || this.finished) return;
        
        this.loading = true;
        
        try {
          const result = await this.$a.ax({
            method: 'GET',
            url: this.qGen()
            // url: `/crud/note/nt?filter=done,eq,0&order=-id&page=${this.page}&size=`+parseInt(this.limitQ)
            // url: `/crud/note/nt?order=-id&page=${this.page}&size=`+parseInt(this.limitQ)
          });

          if (result.success) {
            // Add new nt.noteList to existing nt.noteList
            const newItems = result.data.data;
            this.nt.noteList = [...this.nt.noteList, ...newItems];
            
            // Update pagination
            this.page += 1;
            
            // Check if we've reached the end
            if (newItems.length < parseInt(this.limitQ)) {
              this.finished = true;
            }
          } else {
            console.error('Failed to load data:', result);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          this.loading = false;
        }
      },
      srchAgain(){
        this.finished = false
        this.page = 1
        this.nt.noteList = []
        console.log(this.qGen())

        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
          this.handleManualLoad();
        }, this.typeWaiting);
        this.showSetQuery = false
      }
    },
    watch : {
      'searchQ' : function(nv,ov){
        this.srchAgain()
      },
      'nt.currentShowLocation':function(nv,ov){
        console.log(nv)
        if(nv.length>0){
          this.ShowLocationDisplay = true
        }
      },
      'ShowLocationDisplay':function(nv,ov){
        console.log(nv)
        if(nv == false){
          this.nt.currentShowLocation = ''
        }
      },
      'nt.currentShowPics':function(nv,ov){
        console.log(nv)
        if(nv.length>0){
          this.ShowPicsDisplay = true
        }
      },
      'ShowPicsDisplay':function(nv,ov){
        console.log(nv)
        if(nv == false){
          this.nt.currentShowPics = ''
        }
      },
      'nt.currentNoteEditId':function(nv,ov){
        if(nv !== -1){
          this.NoteEditFormDisplay = true
        }else{
          this.NoteEditFormDisplay = false
        }
      },
      'NoteEditFormDisplay':function(nv,ov){
        if(nv == false){
          this.nt.currentNoteEditId = -1
        }
      },      


    }
    
  }
</script>

<style scoped>
  .v-infinite-scroll__side {
    padding: 0px;
  }
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

  .no-margin {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>