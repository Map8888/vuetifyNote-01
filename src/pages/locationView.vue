<template>
  <p>Server Should Be On Https</p>
  <v-btn @click="setLoc" :disabled="showLoading" color="primary">Get Location</v-btn>
  <v-progress-linear v-if="showLoading" color="yellow-darken-2" indeterminate></v-progress-linear>
  <pre>{{ movLoc }}</pre>
</template>

<script>
export default {
  data() {
    return {
      showLoading: false,
      movLoc: null,
    };
  },
  methods: {
    getLocation() {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (res) => resolve({ success: true, result: res.coords }),
          (err) => resolve({ success: false, error: err.message })
        );
      });
    },
    async setLoc() {
      this.showLoading = true;
      this.movLoc = null;

      try {
        this.movLoc = await this.getLocation();
      } catch (error) {
        console.error("Failed to fetch location:", error);
        this.movLoc = { success: false, error: "Failed to fetch location" };
      } finally {
        this.showLoading = false;
      }
    },
  },
};
</script>