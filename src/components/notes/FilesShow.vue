<template>

<!-- 	<van-swipe v-if="links !== null">
	  <van-swipe-item  v-for="(v,i) in links" :key="i">
	    <span class="custom-indicator">{{ i + 1 }}/{{ links.length }} : {{v.file_name}}</span>
	    <hr>
		<img v-if="isImgFile(v.file_name)" :src="v.url" width="100%" />	
		<div v-else style="color: #fff;font-size: 20px;line-height: 150px;text-align: center;background-color: #39a9ed;">{{v.file_name}}</div>
	  </van-swipe-item>
	</van-swipe> -->

	<v-carousel v-if="links !== null" show-arrows="hover" height="70vh">
	  <template v-for="(v, i) in links">
	    <v-carousel-item v-if="isImgFile(v.file_name)" :src="v.url" width="100vw" >
	    	<v-row class="pt-3 d-flex justify-space-evenly">

	      <v-chip size="small">index:&nbsp;{{ i + 1 }}/{{ links.length }}</v-chip>
	      <v-chip size="small">path:&nbsp;{{v.file_name}}</v-chip>
	      <v-chip size="small">id:&nbsp;{{v.id}}</v-chip>

	    	</v-row>
	    </v-carousel-item>
	  </template>
	</v-carousel>

</template>



<script>
export default {
  setup(){
    // const nt = noteStore();
    return {
      // nt,
    }
  },
  components: {
  },
  props :{
  	str: String,
  	
  },
  data() {
    return {
    	pics : null ,
    	paths : null ,
    	links : null ,
    	imgFiles : ['jpg','png','jpeg']
    };
  },
  created() {
     this.getPics()
     // const mv = this.str.split(",").join("|");
     // console.log(mv)
  },
  mounted(){
  	console.log(this.str)
  },
  methods : {
  	isImgFile(str){
  		return this.imgFiles.includes(str.split(".").at(-1)) == true ? true : false
  	},
  	async getPics() {
  	    const result = await this.$a.ax({
  	      method: 'GET',
  	      url: `/crud/note/note_pics?page=1&size=100&filter=id,in,`+this.str.split(",").join("|")
  	    });

  	    if (result.success) {
  	      this.pics = result.data.data
  	    }

  	},
  	async getLinks() {
  	    const result = await this.$a.ax({
  	      method: 'GET',
  	      url: `/file/get/hskman?paths=`+this.paths.join(",")
  	    });

  	    if (result.success) {
  	      this.links = result.data.files
  	    	for (var i = 0; i < this.links.length; i++) {
  	    		this.links[i].id = this.pics.find(item => item.path+item.pic_name === this.links[i].file_name).id
  	    	}
  	    	console.log(this.link)
  	    }
  	},
  },
  watch : {
	'pics' : function(nv,ov){
		console.log('pics',nv)
		var mv = []
		for (var i = 0; i < nv.length; i++) {
			mv[mv.length] = nv[i].path+nv[i].pic_name
		}
		this.paths = mv
	},
	'paths' : function(nv,ov){
		this.getLinks()
	},
	'links' : function(nv,ov){
		console.log('links',nv)
		console.log(nv)
	}
  }
}
</script>
<style scoped>
.custom-indicator {
/*  position: absolute;*/
  right: 10px;
  bottom: 10px;
  padding: 4px 8px;
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}
</style>