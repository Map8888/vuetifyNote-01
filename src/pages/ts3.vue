<template>
  <v-container class="ma-0 pa-0">
    <v-card elevation="2">
      <v-card-title>Selected Items</v-card-title>
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
          <td>{{ record.pic_name }}</td>
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

    <v-row justify="center" class="mt-4">
      <v-btn @click="getSelectedId()" variant="outlined" density="comfortable">Ok</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      records: [],
      selectedRecords: [],
      searchId: '',
      searchPicName: '',
      searchPath: '',
      currentPage: 1,
      pageSize: 5,
      totalPages: 1
    };
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
    getSelectedId() {
      console.log(this.selectedRecords.map(v => v.id));
    }
  },
  mounted() {
    this.getTopics();
  }
};
</script>
