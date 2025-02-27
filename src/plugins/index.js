/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'

import { AppStore } from '@/stores/appstore';


export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia);
  app.config.globalProperties.$a = AppStore();
}
