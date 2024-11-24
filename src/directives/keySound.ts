import { Directive } from 'vue';
import { KeySoundPlayer } from '@/utils/keySound';
import soundPath from '@/shared/assets/sounds/keydown.mp3';

const soundPlayer = new KeySoundPlayer(soundPath);

export const keySound: Directive = {
  mounted(el: HTMLElement) {
    el.addEventListener('keydown', () => {
      soundPlayer.play();
    });
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('keydown', () => {
      soundPlayer.play();
    });
  },
};
