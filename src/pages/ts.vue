<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>File Upload</v-card-title>
      <v-card-text>
        <v-file-input 
          label="Select File" 
          variant="outlined" 
          @change="handleFileChange"
        ></v-file-input>
        
        <v-text-field v-model="putFile.hostPort" label="File Name" readonly></v-text-field>
        <v-text-field v-model="putFile.fileName" label="File Name" readonly></v-text-field>
        <v-text-field v-model="putFile.fileType" label="File Type" readonly></v-text-field>
        
        <v-btn :disabled="!file" color="primary" @click="uploadFile">
          Upload File
        </v-btn>
        
        <v-alert v-if="putFile.uploadStatus" :type="statusType" class="mt-3">
          {{ putFile.uploadStatus }}
        </v-alert>
        
        <div v-if="putFile.resultDisplay" v-html="putFile.resultDisplay"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);
const putFile = ref({
  hostPort : location.protocol+"//"+location.hostname+':9090',
  fileName: '',
  fileType: '',
  fileBase64: '',
  s3name: 'hskman',
  bucketName: 'hskman',
  filePath: 'tstnav',
  uploadStatus: '',
  resultDisplay: '',
});
const xAuth = 'your-auth-token';

const handleFileChange = async (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    putFile.value.fileName = selectedFile.name;
    putFile.value.fileType = selectedFile.type;
    putFile.value.fileBase64 = await convertToBase64(selectedFile);
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64
    reader.onerror = (error) => reject(error);
  });
};

const uploadFile = async () => {
  if (!file.value) {
    putFile.value.uploadStatus = 'Please select a file to upload.';
    return;
  }
  
  try {
    const formData = new URLSearchParams();
    formData.append('s3name', putFile.value.s3name);
    formData.append('bucketName', putFile.value.bucketName);
    formData.append('fileBase64', putFile.value.fileBase64);
    formData.append('fileType', putFile.value.fileType);
    // formData.append('fileName', putFile.value.fileName);
    formData.append('fileName', Date.now()+".jpg");
    formData.append('filePath', putFile.value.filePath);

    const response = await fetch(putFile.value.hostPort+'/file/put', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-AUTH': 'secure-auth-token',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      const responseData = await response.json();
      putFile.value.resultDisplay = `<a href="${responseData.url}">${responseData.file_path}</a>`;
      putFile.value.uploadStatus = 'File uploaded successfully!';
    } else {
      const errorData = await response.json();
      putFile.value.uploadStatus = `Error: ${errorData.error}`;
    }
  } catch (error) {
    putFile.value.uploadStatus = `Error: ${error.message}`;
  }
};
</script>

<style scoped>
.v-container {
  max-width: 400px;
  margin: auto;
}
</style>
