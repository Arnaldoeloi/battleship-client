import { createApp } from 'vue'
import Toast from "vue-toastification";
import App from './App.vue'
import "vue-toastification/dist/index.css";




let app = createApp(App)

WebSocket.prototype.emit = function (eventName, payload) {
  console.log('Sending event...'+eventName,payload);
  this.send(JSON.stringify({eventName, payload}));
}


// ws.prototype.emit = function (eventName, payload) {
//   this.send(JSON.stringify({eventName, payload}));
// }
app.use(Toast, {});



app.mount('#app')


