import { defineStore } from 'pinia'


export const noteStore = defineStore('notestore', {
    state: () => ({
        noteList : [] ,
        topicsList : null ,
        currentShowLocation : "" ,
        currentShowPics : "" ,
        // NoteEditFormDisplay : false ,
        currentNoteEditId : -1 ,
        currentNoteEditOperation : '' ,


    }),
    actions: {
        getTimeZoneOffset() {
            const offsetMinutes = new Date().getTimezoneOffset(); // Offset in minutes (UTC - local time)
            const sign = offsetMinutes > 0 ? '-' : '+'; // Invert because getTimezoneOffset() returns negative for positive timezones
            const hours = Math.floor(Math.abs(offsetMinutes) / 60)
                .toString()
                .padStart(2, '0');
            const minutes = (Math.abs(offsetMinutes) % 60)
                .toString()
                .padStart(2, '0');

            return `${sign}${hours}:${minutes}`;
        }
        // setTo(op,id){
        //     this.currentNoteEditId = id;
        //     this.currentNoteEditOperation = op;
        // }
    },
})
