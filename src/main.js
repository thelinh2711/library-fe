import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router"; // 🔥 import router

const app = createApp(App);

app.use(createPinia());
app.use(router); // 🔥 gắn router vào app

app.mount("#app");
