<template>
  
    <div class="coordinates">
      <span>Latitude: <strong>{{ currentLatitude }}</strong></span>
      <br>
      <span>Longitude: <strong>{{ currentLongitude }}</strong></span>
      <br>
      <button @click="copyCoordinates">Copy Coordinates</button>
    </div>
    <div ref="mapContainer" class="map-container" style="height: 500px;"></div>
  
</template>

<script>
export default {
  props: {
    str: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      latitude: null,
      longitude: null,
      popupShowLocation: true,
      currentLatitude: null,
      currentLongitude: null,
    };
  },
  created() {
    try {
      const mv = JSON.parse(this.str);
      this.latitude = mv.lat;
      this.longitude = mv.long;
      this.currentLatitude = this.latitude.toFixed(8);
      this.currentLongitude = this.longitude.toFixed(8);
      this.popupShowLocation = true;
    } catch (error) {
      console.error('Failed to parse coordinates:', error);
    }
  },
  mounted() {
    import('leaflet').then(L => {
      const map = L.map(this.$refs.mapContainer).setView([this.latitude, this.longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker(
        [this.latitude, this.longitude], { draggable: true }
      ).addTo(map);

      marker.on('dragend', (event) => {
        const latlng = event.target.getLatLng();
        this.currentLatitude = latlng.lat.toFixed(8);
        this.currentLongitude = latlng.lng.toFixed(8);
      });
    }).catch(error => {
      console.error('Error loading Leaflet:', error);
    });
  },
  methods: {
    copyCoordinates() {
      const coords = `Latitude: ${this.currentLatitude}, Longitude: ${this.currentLongitude}`;
      navigator.clipboard.writeText(coords).then(() => {
        alert('Coordinates copied to clipboard!');
      }).catch(error => {
        alert('Failed to copy coordinates:', error);
      });
    }
  },
  watch : {

  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
.coordinates {
  margin-bottom: 10px;
  font-size: 16px;
}
.coordinates span {
  display: inline-block;
  margin-bottom: 5px;
}
button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}
</style>