<template>
  <div
    class="floating-button"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    
    <v-speed-dial
      location="bottom center"
      transition="fade-transition"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab
          v-bind="activatorProps"
          size="large"
          icon="$vuetify"
          color="blue-darken-4"
        ></v-fab>
      </template>

      <v-btn @click="$router.push('/')" key="1" icon="mdi-home"></v-btn>
      <v-btn @click="$a.setting.showPage = !$a.setting.showPage" key="2" icon="mdi-reorder-horizontal"></v-btn>
      <v-btn @click="$router.push('/notes')" key="3" icon="mdi-notebook"></v-btn>
      <v-btn @click="$router.push('/ts')" key="4" icon="mdi-alpha-t-circle-outline"></v-btn>
      <v-btn @click="$router.push('/ts2')" key="4" icon="mdi-alpha-t-circle-outline"></v-btn>


    </v-speed-dial>

  </div>
</template>

<script>
export default {
  data() {
    return {
      position: { x: 100, y: 100 }, // Initial position
      isDragging: false,
      offset: { x: 0, y: 0 },
    };
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      
      let clientX, clientY;
      if (event.type === "touchstart") {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.offset.x = clientX - this.position.x;
      this.offset.y = clientY - this.position.y;

      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDrag);
      document.addEventListener("touchmove", this.onDrag);
      document.addEventListener("touchend", this.stopDrag);
    },
    onDrag(event) {
      if (!this.isDragging) return;

      let clientX, clientY;
      if (event.type === "touchmove") {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.position.x = clientX - this.offset.x;
      this.position.y = clientY - this.offset.y;
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
      document.removeEventListener("touchmove", this.onDrag);
      document.removeEventListener("touchend", this.stopDrag);
    },
    onClick() {
      alert("Button clicked!");
    },
  },
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  z-index: 9999;
  cursor: grab;
  user-select: none;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}
</style>
