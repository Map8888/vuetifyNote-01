/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import 'leaflet/dist/leaflet.css';
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'



const app = createApp(App)

registerPlugins(app)



app.mount('#app')
