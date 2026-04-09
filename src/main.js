import { createApp } from 'vue';
<<<<<<< HEAD
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

=======
import { createPinia } from 'pinia'; // 1. Pinia 불러오기
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia(); // 2. Pinia 인스턴스 생성

app.use(pinia); // 3. 앱에 Pinia 등록
>>>>>>> ca63f67c0a4c26ab11d9c0087a1ef11640a417b8
app.mount('#app');
