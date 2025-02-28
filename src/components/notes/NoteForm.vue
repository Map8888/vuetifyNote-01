<template>
    <v-dialog
      v-model="nt.currentNoteEdit.showForm"
      transition="dialog-bottom-transition"
      fullscreen
    >
    <v-sheet class="pa-1">

      <v-row justify="space-around" no-gutters> 

        <v-chip variant="text" >{{nt.currentNoteEdit.operation}}</v-chip>

        <v-chip variant="text" >id:{{curNote.id}}</v-chip>

        <v-chip variant="text" >parent:{{curNote.parent_id}}
          <v-icon icon="mdi-human-female-girl"></v-icon>
        </v-chip>
          
        <v-chip variant="text" @click="curNote.dir = ( curNote.dir == 'rtl' ? 'ltr' : 'rtl')">
          dir:{{ ' '+curNote.dir }}
          <v-icon :icon="curNote.dir == 'ltr' ? 'mdi-hand-pointing-right' : 'mdi-hand-pointing-left'"></v-icon>
        </v-chip>

        <v-chip 
          :variant="noteLength > 5 ? 'flat' : 'text'"
          :color="noteLength > 5 ? 'red' : ''"
          >
            length:{{noteLength}}
        </v-chip>

        


      </v-row>
      <v-row no-gutters> 
        <v-textarea
          :dir="curNote.dir"
          clear-icon="mdi-close-circle"
          :label="'Note :'+this.curNote.note.length+' Charecter'"
          variant="outlined"
          clearable
          auto-grow
          hide-details
          row-height="9"
          rows="2"
          :color="noteLength > 5 ? 'red-accent-1' : ''"
          v-model="curNote.note"
        >
      </v-textarea>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field label="parent" variant="underlined" v-model="curNote.parent_id" hide-details></v-text-field>
        </v-col>
        <v-col>
            <v-select
              clearable
              hide-details
              v-model="curNote.topic_id" 
              :items="nt.topicsList" 
              item-title="topic" 
              item-value="id" 
              label="Topic_id"
              readonly
              @click="topicListShow = true"
              variant="underlined">
            </v-select>
            <v-dialog v-model="topicListShow" width="50vw">
              <v-sheet>
                <v-radio-group v-model="curNote.topic_id">
                  <v-radio v-for="(v,i) in nt.topicsList" :label="v.id+' : '+v.topic" :value="v.id"
                    @click="topicListShow = false"
                  ></v-radio>
                </v-radio-group>
              </v-sheet>
            </v-dialog>
        </v-col>
      </v-row>
      <v-row no-gutters>
          <v-col cols="7" >
            <v-text-field hide-details clearable variant="underlined" label="Date" type="date" v-model="nextDate"></v-text-field>
          </v-col>
          <v-col cols="4" >
            <v-text-field hide-details clearable variant="underlined" label="Time" type="time" v-model="nextTime"></v-text-field>
          </v-col>
          <v-col cols="1" class="d-flex justify-center align-center">
            <v-icon icon="mdi-human-female-girl"></v-icon>
          </v-col>
      </v-row>
      <v-row no-gutters> 
        <v-text-field label="location" variant="underlined" v-model="curNote.location" hide-details></v-text-field>
        <!-- <v-btn variant="outlined" width="100vw" >location: {{curNote.location}}</v-btn> -->
      </v-row>
      <v-row no-gutters> 

        

      </v-row>
      <v-row no-gutters> 
        <v-btn variant="outlined" width="100vw" >pics: {{curNote.pics}}</v-btn>
      </v-row>



      <pre>{{nt.currentNoteEdit}}</pre>
      <pre>{{ nt.currentNoteEdit.listId !== -1 ? nt.noteList[nt.currentNoteEdit.listId] : ''}}</pre>

      
      <v-btn @click="close" style="width: 100%;" color="red-darken-3">Close</v-btn>
    </v-sheet>
  </v-dialog>

  


</template>

<script>
  import { noteStore } from '../../stores/notestore'
  export default {
    setup(){
      const nt = noteStore();
      return {
        nt,
      }
    },
    components: {

    },
    data() {
      return {
        topicListShow : false,
        nextDate : '',
        nextTime : '',
        curNote : {
          id : 0 ,
          topic_id : null ,
          parent_id : 0 ,
          note : "sd" ,
          done : false ,
          location : "" ,
          pics : "" ,
          insert_date : "" ,
          update_date : "" ,
          next_date : "" ,
          dir : "rtl"
        }
      };
    },
    computed: {
      noteLength(){
        return this.curNote.note.length
      }
    },
    beforeMount(){
      // this.firstProcessing()
    },
    mounted(){
      
      // console.log(this.nt.noteList[this.nt.currentNoteEdit.listId])
    },
    methods: {
      firstProcessing(){
        if(this.nt.currentNoteEdit.operation == 'add'){

        }
        else if(this.nt.currentNoteEdit.operation == 'edit'){

        }
        else if(this.nt.currentNoteEdit.operation == 'fork'){

        }
        console.log(this.nt.noteList[this.nt.currentNoteEdit.listId])
      },
      close(){
        this.nt.currentNoteEdit = { showForm : false , listId : -1 , operation : '' , parent : 0 , }
      },
    },
    watch : {
      'curNote.topic_id':function(nv,ov){
        console.log(nv)
      }
    }
  }
</script>



