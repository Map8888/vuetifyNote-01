<template>

    <v-card >
      <v-card-title>File Upload</v-card-title>
      <v-card-text>
        <v-file-input 
          label="Select File" 
          variant="outlined" 
          @change="handleFileChange"
          show-size
          hide-details
        ></v-file-input>

            <v-card class="mt-4 pt-4" v-if="file">
              <v-card-text>

                <v-slider
                  v-if="isImage"
                  v-model="selectedQuality"
                  thumb-label="always"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  hide-details
                ></v-slider>
              <v-card-title>Selected File Preview</v-card-title>

                <div v-if="isImage" class="image-preview">
                  <div class="image-container">
                    <v-img :src="filePreview" max-height="200"></v-img>
                    <p>Original Image</p>
                    <p>Size: {{ originalImageSize }} KB</p>
                  </div>
                  <div class="image-container" v-if="reducedQualityImage">
                    <v-img :src="reducedQualityImage" max-height="200"></v-img>
                    <p>Reduced Quality Image ({{ selectedQuality * 100 }}%)</p>
                    <p>Size: {{ reducedImageSize }} KB</p>
                  </div>
                </div>
                <v-icon v-else size="50">mdi-file</v-icon>
              </v-card-text>
            </v-card>
        <v-row>
          <v-col cols="4" class="pa-0">
            <v-text-field v-model="putFile.hostPort" label="File Name" readonly hide-details></v-text-field>
          </v-col>
          <v-col cols="4" class="pa-0">
            <v-text-field v-model="putFile.fileName" label="File Name" readonly hide-details></v-text-field>
          </v-col>
          <v-col cols="4" class="pa-0">
            <v-text-field v-model="putFile.fileType" label="File Type" readonly hide-details></v-text-field>
          </v-col>
        </v-row>
        <br>        
        <br>
        <br>
        <v-row>
          <v-col cols="4" class="pa-0 d-flex justify-center">
            <v-btn color="error" @click="clearFile" class="mr-2">
              Clear File
            </v-btn>
          </v-col>
          <v-col cols="4" class="pa-0 d-flex justify-center">
            <v-btn :disabled="!file" color="primary" @click="uploadFile">
              Upload File
            </v-btn>
          </v-col>
          <v-col cols="4" class="pa-0 d-flex justify-center">
            <v-btn color="primary" @click="addToPicTable()">
              Add
            </v-btn>
          </v-col>
        </v-row>
                
        
        
        


        


        
        <v-progress-circular v-if="isUploading" indeterminate color="primary" class="mt-3"></v-progress-circular>
        
        <v-alert v-if="putFile.uploadStatus" :type="statusType" class="mt-3">
          <span v-html="putFile.uploadStatus"></span>
        </v-alert>
        
        <div v-if="putFile.resultDisplay" v-html="putFile.resultDisplay"></div>
      </v-card-text>
    </v-card>

    

</template>

<script>
  import axios from 'axios'
export default {
  data() {
    return {
      statusType : null,
      mv : 1.0 ,
      file: null,
      isUploading: false,
      filePreview: null,
      reducedQualityImage: null,
      selectedQuality: 1.0, // Default quality (1 = 100%)
      originalImageSize: 0, // Size of the original image in KB
      reducedImageSize: 0, // Size of the reduced quality image in KB
      putFile: {
        hostPort: location.protocol + "//" + location.hostname + ':9090',
        fileName: '',
        fileNameTime: '',
        filePath: '',
        fileType: '',
        fileBase64: '',
        s3name: 'hskman',
        bucketName: 'hskman',
        filePath: 'tstnav',
        // filePath: 'erp/006/001',
        uploadStatus: '',
        resultDisplay: '',
      },
      xAuth: 'your-auth-token',
    };
  },
  computed: {
    isImage() {
      return this.file && this.file.type.startsWith("image");
    },
  },
  watch: {
    selectedQuality(newQuality) {
      if (this.file && this.file.type.startsWith("image")) {
        this.reduceImageQuality(this.file, newQuality).then((reducedImage) => {
          this.reducedQualityImage = reducedImage;
        });
      }
    },
    'statusType':function(nv,no){
      console.log(nv)
    }
  },
  methods: {
    // pic_name: '1701508059728.jpg', path: 'notePics/'
    async addToPicTable(fileName,Path) {
        const result = await this.$a.ax({
          method: 'POST',
          url: `/crud/note/note_pics`,
          data : { pic_name : fileName , path :Path}
        });
        if (result.success) {
          return result.data;
        }else{
          return 0;
        }
    },

    async handleFileChange(event) {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        this.file = selectedFile;
        this.putFile.fileName = selectedFile.name;
        this.putFile.fileType = selectedFile.type;
        this.putFile.fileBase64 = await this.convertToBase64(selectedFile);
        
        if (selectedFile.type.startsWith("image")) {
          this.filePreview = URL.createObjectURL(selectedFile);
          this.originalImageSize = (selectedFile.size / 1024).toFixed(2); // Calculate original size in KB
          this.reducedQualityImage = await this.reduceImageQuality(selectedFile, this.selectedQuality);
        } else {
          this.filePreview = null;
          this.reducedQualityImage = null;
        }
      }
    },
    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64
        reader.onerror = (error) => reject(error);
      });
    },
    reduceImageQuality(file, quality) {
      return new Promise((resolve) => {
        // If quality is 1 (100%), return the original file without compression
        if (quality === 1) {
          const reader = new FileReader();
          reader.onload = () => {
            this.reducedImageSize = (file.size / 1024).toFixed(2); // Use original file size
            resolve(reader.result); // Return the original file as a data URL
          };
          reader.readAsDataURL(file); // Convert the original file to a data URL
          return;
        }

        // For quality < 1, apply compression
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set the canvas dimensions to the image dimensions
          // canvas.width = img.width;
          // canvas.height = img.height;

          const nwW = parseInt( img.width*parseFloat(quality) )
          const nwH = parseInt( nwW*img.height/img.width)
          
          canvas.width = nwW;
          canvas.height = nwH;
          // Draw the image on the canvas
          // ctx.drawImage(img, 0, 0);
          ctx.drawImage(img, 0, 0,nwW,nwH);
          
          // Reduce the quality of the image
          const reducedImage = canvas.toDataURL('image/jpeg');
          
          // Calculate the size of the reduced image in KB
          const reducedImageSizeKB = (reducedImage.length * 0.75) / 1024; // Approximate size calculation
          this.reducedImageSize = reducedImageSizeKB.toFixed(2);
          
          resolve(reducedImage);
        };
      });
    },
    clearFile() {
      this.file = null;
      this.filePreview = null;
      this.reducedQualityImage = null;
      this.originalImageSize = 0;
      this.reducedImageSize = 0;
      this.putFile.fileName = '';
      this.putFile.fileType = '';
      this.putFile.fileBase64 = '';
    },

    async uploadFile() {
      if (!this.file) {
        this.putFile.uploadStatus = 'Please select a file to upload.';
        return;
      }

      try {
        this.isUploading = true;

        // Use the reduced quality image if it exists
        const fileToUpload = this.reducedQualityImage 
          ? await this.dataURLtoFile(this.reducedQualityImage, this.file.name) 
          : this.file;

        const fileBase64 = await this.convertToBase64(fileToUpload);

        this.putFile.fileNameTime = Date.now() + "." + this.putFile.fileName.split(".").at(-1) ;

        const formData = new URLSearchParams();
        formData.append('s3name', this.putFile.s3name);
        formData.append('bucketName', this.putFile.bucketName);
        formData.append('fileBase64', fileBase64);
        formData.append('fileType', this.putFile.fileType);
        // formData.append('fileName', this.putFile.fileName);
        formData.append('fileName', this.putFile.fileNameTime );
        formData.append('filePath', this.putFile.filePath);

        const response = await axios.post(
          this.putFile.hostPort + '/file/put',
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-AUTH': 'secure-auth-token',
            },
          }
        );

        if (response.status === 200) {
          var mv_fileName = response.data.file_path.split('/').at(-1);
          var mv_Path = response.data.file_path.split('/').slice(0, -1).join('/')+"/";
          var mv_inf = await this.addToPicTable(mv_fileName,mv_Path);
          

          if(mv_inf !== 0){
            console.log(mv_inf)
            const responseData = response.data;
            this.putFile.uploadStatus = 'id: '+mv_inf.id+'pic_name: '+mv_inf.pic_name+'path: '+mv_inf.path+'<br>File uploaded successfully And Add To Database successfully!';
            this.putFile.resultDisplay = `<a href="${responseData.url}">${responseData.file_path}</a><br><img src="${responseData.url}" />`;
          }else{
            console.log(mv_inf)
            const responseData = response.data;
            
            this.putFile.uploadStatus = 'File uploaded successfully But Add To Database  Not successfully!!';
          }
          
        }
      } catch (error) {
        this.putFile.uploadStatus = `Error: ${error.response?.data?.error || error.message}`;
      } finally {
        this.isUploading = false;
      }
    },

    dataURLtoFile(dataURL, filename) {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 400px;
  margin: auto;
}

.image-preview {
  display: flex;
  gap: 16px;
}

.image-container {
  text-align: center;
}
</style>