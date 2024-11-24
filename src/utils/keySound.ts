export class KeySoundPlayer {
    private audio: HTMLAudioElement;

    constructor(audioPath: string) {
        this.audio = new Audio(audioPath);
    }

    play() {
        if (this.audio) {
        this.audio.currentTime = 0; // Reset to the start for fast typing
        this.audio.play().catch((err) => {
            console.warn('Error playing sound:', err);
        });
        }
    }
}
  