import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 1. Pinia 불러오기
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia(); // 2. Pinia 인스턴스 생성

app.use(pinia); // 3. 앱에 Pinia 등록
app.mount('#app');
