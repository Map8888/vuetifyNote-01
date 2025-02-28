<template>
  <v-card class="tweet-card pa-3" flat>

        <v-row class="d-flex justify-space-between">
          <v-chip size="x-small">id:{{nt.noteList[listId].id}}</v-chip>
          <v-chip size="x-small">@{{nt.topicsList.find(item => item.id === nt.noteList[listId].topic_id).topic}}</v-chip>
          <v-chip size="x-small">paret:{{nt.noteList[listId].parent_id}}</v-chip>
        </v-row>
        
        <v-row class="d-flex justify-center">
          <!-- <v-col> -->
            <p 
            	class="tweet-text"
            	style="text-align:center;white-space: pre-line;"
            	:class="nt.noteList[listId].done == true ? 'text-decoration-line-through' : ''"
            	v-html="nt.noteList[listId].note.replace(/\n/g, '<br>')"
            ></p>
          <!-- </v-col> -->
        </v-row>
        
        <!-- Actions -->
        
        <v-row class="mt-2 d-flex justify-space-evenly">

          <v-btn icon variant="text" size="small">
           <v-icon :color="nt.noteList[listId].done == true ? 'light-green-accent-4' : 'red-lighten-1'">
         		{{ nt.noteList[listId].done == true ? 'mdi-check-bold' :'mdi-close-circle-outline'}}
         	</v-icon>
          </v-btn>

          <v-btn @click="nt.currentShowLocation = ( nt.currentShowLocation.length > 0 ? '' : nt.noteList[listId].location)" icon :color=" nt.noteList[listId].location.length > 0 ? 'blue-darken-2' : ''" variant="text" size="small">
            <v-icon>{{ nt.noteList[listId].location.length > 0 ? 'mdi-map-marker-multiple' : 'mdi-map-marker-outline' }}</v-icon>
          </v-btn>

          <v-btn @click="nt.currentShowPics = nt.noteList[listId].pics" icon :color=" nt.noteList[listId].pics.length > 0 ? 'blue-darken-2' : ''" variant="text" size="small">
            <v-icon>{{ nt.noteList[listId].pics.length > 0 ? 'mdi-tooltip-image' : 'mdi-tooltip-image-outline'}}</v-icon>
          </v-btn>
          
          <v-btn icon variant="text" size="small"
            @click="nt.currentNoteEdit = { 
              showForm : true ,
              listId :  listId,
              operation : 'edit' ,
              parent : 0 ,
            }"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>

          <v-btn icon variant="text" size="small"
            @click="nt.currentNoteEdit = { 
              showForm : true ,
              listId :  -1,
              operation : 'add' ,
              parent : 0 ,
            }"
          >
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>

          <v-btn icon variant="text" size="small"
            @click="nt.currentNoteEdit = { 
              showForm : true ,
              listId :  listId,
              operation : 'fork' ,
              parent : nt.noteList[listId].id ,
            }"
          >
            <v-icon>mdi-source-merge</v-icon>
          </v-btn>
                    
        </v-row>

        <v-row class="mt-2 d-flex justify-space-evenly">
        	<v-chip class="text-disabled" size="x-small">{{nt.noteList[listId].insert_date}}</v-chip>
        	<v-chip class="text-disabled" size="x-small">{{nt.noteList[listId].next_date}}</v-chip>
        	<v-chip class="text-disabled" size="x-small">{{nt.noteList[listId].update_date}}</v-chip>
        </v-row>

  </v-card>

</template>

<script>
import { noteStore } from '../../stores/notestore';

export default {
  props: {
    listId: Number,
  },
  setup() {
    const nt = noteStore();
    return { nt };
  },
  computed: {

  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
};
</script>

<style scoped>

.tweet-card {
  border-bottom: 1px solid #e1e8ed;
  border-radius: 0;
  width: 100%;
}
.tweet-text {
  font-size: 16px;
  line-height: 1.5;
}
</style>