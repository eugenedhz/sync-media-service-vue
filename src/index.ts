import { app } from './app';
import { keySound } from '@/directives/keySound';

app.directive('key-sound', keySound);
app.mount('#app');
