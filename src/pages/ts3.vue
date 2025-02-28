<template>
  <v-container class="ma-0 pa-0">
    <v-card elevation="2">
      <v-card-text>
        <div v-if="selectedRecords.length">
          {{ selectedRecords.map(r => r.id+' : '+r.pic_name).join(', ') }}
        </div>
        <div v-else>No items selected</div>
      </v-card-text>
    </v-card>

    <table style="width: 100%;">
      <tbody>
        <tr>
          <td>
            <v-text-field 
              append-inner-icon="mdi-plus"
              prepend-inner-icon="mdi-minus"
              @click:append-inner="changePage(currentPage + 1)"
              @click:prepend-inner="changePage(currentPage - 1)"
              v-model="currentPage"
              label="Page"
              hide-details
            ></v-text-field> 
          </td>
          <td>
            <v-text-field 
              v-model="searchId"
              label="Search by ID"
              clearable
              hide-details
              @update:modelValue="getTopics"
            ></v-text-field> 
          </td>
          <td>
            <v-text-field 
              v-model="searchPicName"
              label="Search by Pic Name"
              clearable
              hide-details
              @update:modelValue="getTopics"
            ></v-text-field> 
          </td>
          <td>
            <v-text-field 
              v-model="searchPath"
              label="Search by Path"
              clearable
              hide-details
              @update:modelValue="getTopics"
            ></v-text-field> 
          </td>
        </tr>
        <tr v-for="record in records" :key="record.id">
          <td>
            <v-checkbox v-model="selectedRecords" :value="record" density="compact" hide-details></v-checkbox>
          </td>
          <td>{{ record.id }}</td>
          <td @click="getLinks(record.path+record.pic_name)" style="color:red;">{{ record.pic_name }}</td>
          <td>{{ record.path }}</td>
        </tr>
      </tbody>
    </table>

    <v-row justify="center" >
      <v-pagination 
        v-model="currentPage"
        :length="totalPages"
        :total-visible="3"
        @update:modelValue="getTopics"
      ></v-pagination>
    </v-row>

    <v-row justify="center" class="mt-2 mb-2">
      <v-btn @click="getSelectedId()" variant="outlined" density="comfortable">Ok</v-btn>
    </v-row>
  </v-container>
  <v-card elevation="2" >
    <v-progress-linear v-show="showLoadingObject" color="yellow-darken-2" indeterminate ></v-progress-linear>

    <v-carousel v-if="currentPathShow !== null" show-arrows="hover" height="45vh">
        <v-carousel-item :src="currentPathShow.url"  @load="this.showLoadingObject = false" width="100vw" >
          <v-chip prepend-icon="mdi-file-image" variant="elevated" color="primary">
          file name:&nbsp;{{currentPathShow.file_name}}
          </v-chip>
        </v-carousel-item>
    </v-carousel>

    <!-- <img v-if="currentPathShow !== null" :src="currentPathShow" @load="onLoadImage"/> -->
  </v-card>
<!--   <v-navigation-drawer app
    v-model="ShowPicsDisplay"
    location="bottom"
    persistent
    temporary
    >
    <FilesShow v-if="ShowPicsDisplay" :str="nt.currentShowPics" />
    <v-btn @click="ShowPicsDisplay = false" style="width: 100%;" color="primary">Close</v-btn>
  </v-navigation-drawer> -->
</template>

<script>
  // import FilesShow from '../components/notes/FilesShow.vue'
  // import { noteStore } from '../stores/notestore'
  
export default {
  setup(){
    // const nt = noteStore();
    // return {
    //   nt,
    // }
  },
  data() {
    return {
      records: [],
      selectedRecords: [],
      searchId: '',
      searchPicName: '',
      searchPath: '',
      currentPage: 1,
      pageSize: 5,
      totalPages: 1,
      ShowPicsDisplay : false ,
      showLoadingObject : false ,
      currentPathShow : null ,
    };
  },
  components: {
    // FilesShow,
  },
  methods: {

    async getTopics() {
      const filters = [];
      if (this.searchId) filters.push(`&filter=id,cs,${this.searchId}`);
      if (this.searchPicName) filters.push(`&filter=pic_name,cs,${this.searchPicName}`);
      if (this.searchPath) filters.push(`&filter=notePics,cs,${this.searchPath}`);
      filters.push('&order=-id');
      
      const result = await this.$a.ax({
        method: 'GET',
        url: `/crud/note/note_pics?page=${this.currentPage}&size=${this.pageSize}${filters.join('')}`,
      });

      if (result.success) {
        this.records = result.data.data;
        this.totalPages = result.data.total_pages;
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.getTopics();
      }
    },
    async getLinks(inp) {
      this.currentPathShow = null
      this.showLoadingObject = true
        const result = await this.$a.ax({
          method: 'GET',
          url: `/file/get/hskman?paths=`+inp
        });
        if (result.success) {
          this.currentPathShow = result.data.files[0]
          console.log(this.currentPathShow)
          // this.links = result.data.files
          // for (var i = 0; i < this.links.length; i++) {
          //   this.links[i].id = this.pics.find(item => item.path+item.pic_name === this.links[i].file_name).id
          // }
        }
    },
    // getSelectedId() {
    //   console.log(this.selectedRecords.map(v => v.id));
    // }
  },
  mounted() {
    this.getTopics();
  },
  watch:{
    // 'nt.currentShowPics':function(nv,ov){
    //   // console.log(nv)
    //   if(nv.length>0){
    //     this.ShowPicsDisplay = true
    //   }
    // },
    // 'ShowPicsDisplay':function(nv,ov){
    //   // console.log(nv)
    //   if(nv == false){
    //     this.nt.currentShowPics = ''
    //   }
    // },
  }
};
</script>
