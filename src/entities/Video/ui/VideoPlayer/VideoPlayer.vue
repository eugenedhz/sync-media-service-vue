<template>
    <div class="video-container" ref="videoContainer" data-volume-level="high">
        <div class="video-controls-container">
            <div
                ref="timelineContainer"
                @mousemove="handleTimelineUpdate($event)"
                @mousedown="toggleScrubbing($event)"
                class="timeline-container"
            >
                <div class="timeline">
                    <div class="thumb-indicator"></div>
                </div>
            </div>
            <div class="controls">
                <div class="duration-container">
                    <div class="current-time">{{ currentTime }}</div>
                    /
                    <div class="total-time">{{ totalTime }}</div>
                </div>
                <button @click="togglePlay()" class="play-pause-btn">
                    <template v-if="isPlaying">
                        <svg class="pause-icon" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M14,19H18V5H14M6,19H10V5H6V19Z"
                            />
                        </svg>
                    </template>
                    <template v-else>
                        <svg class="play-icon" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M8,5.14V19.14L19,12.14L8,5.14Z"
                            />
                        </svg>
                    </template>
                </button>
                <div class="volume-container">
                    <button @click="toggleMute()" class="mute-btn">
                        <svg class="volume-high-icon" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                            />
                        </svg>
                        <svg class="volume-low-icon" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                            />
                        </svg>
                        <svg class="volume-muted-icon" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                            />
                        </svg>
                    </button>
                    <input
                        class="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="any"
                        :value="volumeSlider"
                        @input="setVolume($event)"
                    />
                </div>
                <button @click="toggleFullScreenMode()" class="full-screen-btn">
                    <svg class="open" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                        />
                    </svg>
                    <svg class="close" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <video
            @click="togglePlay()"
            @loadeddata="setTotalTime()"
            @timeupdate="timeUpdate()"
            @volumechange="volumeChange()"
            ref="video"
            id="js-video"

            :src="src"
        >
            <track kind="captions" srclang="en" src="assets/subtitles.vtt" />
        </video>
        <slot
            name="controls"
            :setCurrentTime="setCurrentTime"
        ></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
    src: {
        type: String
    }
});
const emit = defineEmits([
    'playerInit',
    'timeUpdate',
    'playToggle'
])

const video = ref<HTMLVideoElement | null>(null);
const videoContainer = ref<HTMLElement | null>(null);
const timelineContainer = ref<HTMLElement | null>(null);
const volumeSlider = ref<number>(1);
const isPlaying = ref<boolean>(false);
const isScrubbing = ref<boolean>(false);
const wasPaused = ref<boolean>(false);
const totalTime = ref<string>('');
const currentTime = ref<string>('0:00');

defineExpose({
    video
})

const setCurrentTime = (currentTime: number) => {
    if (!video.value) return;
    video.value.currentTime = currentTime;
};

const setPlaying = (flag: boolean) => {
    isPlaying.value = flag;
};

const togglePlay = () => {
    if (!video.value?.paused) {
        video.value?.pause();
        setPlaying(false);
    } else {
        video.value?.play();
        setPlaying(true);
    }

    emit('playToggle', { currentTime: video.value.currentTime, isPaused: video.value.paused });
};

const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null) {
        videoContainer.value?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

const toggleMute = () => {
    if (!video?.value) return;
    video.value.muted = !video?.value?.muted;
    console.log(video.value.muted, video.value.volume)
};

const toggleScrubbing = (e: MouseEvent) => {
    const rect = timelineContainer.value?.getBoundingClientRect();
    if (!rect) return;

    const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing.value = (e.buttons & 1) === 1;

    videoContainer.value?.classList.toggle('scrubbing', isScrubbing.value);

    if (!video.value) return;

    if (isScrubbing.value) {
        wasPaused.value = video.value.paused;
        video.value?.pause();
    } else {
        video.value.currentTime = percent * video.value.duration;
        if (!wasPaused.value) video.value.play();
    }

    emit('timeUpdate', { currentTime: video.value.currentTime, isPaused: video.value.paused });
    handleTimelineUpdate(e);
};

const handleTimelineUpdate = (e: MouseEvent) => {
    const rect = timelineContainer.value?.getBoundingClientRect();
    if (!rect) return;

    const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    timelineContainer.value?.style.setProperty(
        '--preview-position',
        percent.toString()
    );

    if (isScrubbing.value) {
        e.preventDefault();
        timelineContainer.value?.style.setProperty(
            '--progress-position',
            percent.toString()
        );
    }
};

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
});
const formatDuration = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
        return `${hours}:${leadingZeroFormatter.format(
            minutes
        )}:${leadingZeroFormatter.format(seconds)}`;
    }
};

const setTotalTime = () => {
    if (!video.value) return;
    totalTime.value = formatDuration(video.value.duration);
};

const timeUpdate = () => {
    if (!video.value) return;
    currentTime.value = formatDuration(video.value.currentTime);

    const percent = video.value.currentTime / video.value.duration;
    timelineContainer.value?.style.setProperty(
        '--progress-position',
        percent.toString()
    );
};

const setVolume = (e: Event) => {
    if (!video.value) return;
    volumeSlider.value = Number((e.target as HTMLInputElement).value);
    video.value.volume = volumeSlider.value
    video.value.muted = volumeSlider.value === 0;
};

const volumeChange = () => {
    if (!video.value || !volumeSlider.value) return;
    volumeSlider.value = video.value.volume;

    let volumeLevel;
    if (video.value.muted || video.value.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = 'muted';
    } else if (video.value.volume >= 0.5) {
        volumeLevel = 'high';
    } else {
        volumeLevel = 'low';
    }

    videoContainer.value!.dataset.volumeLevel = volumeLevel;
};

const skip = (duration: number) => {
    if (!video?.value) return;
    video.value.currentTime += duration;
};

const applyHotkeys = (e: KeyboardEvent) => {
    const tagName = document.activeElement?.tagName.toLowerCase();

    if (tagName === 'input') return;

    switch (e.key.toLowerCase()) {
        case ' ':
            if (tagName === 'button') break;
        case 'k':
            togglePlay();
            break;
        case 'f':
            toggleFullScreenMode();
            break;
        case 'm':
            toggleMute();
            break;
        case 'arrowleft':
        case 'j':
            skip(-5);
            break;
        case 'arrowright':
        case 'l':
            skip(5);
            break;
        default:
            break;
    }
};

const applyScrubbing = (e: MouseEvent) => {
    if (isScrubbing.value) toggleScrubbing(e);
};

const applyTimelineUpdate = (e: MouseEvent) => {
    if (isScrubbing.value) handleTimelineUpdate(e);
};

const applyFullScreen = () => {
    videoContainer.value?.classList.toggle(
        'full-screen',
        document.fullscreenElement as unknown as boolean
    );
};

onMounted(() => {
    document.addEventListener('keydown', applyHotkeys);
    document.addEventListener('mouseup', applyScrubbing);
    document.addEventListener('mousemove', applyTimelineUpdate);
    document.addEventListener('fullscreenchange', applyFullScreen);
    emit('playerInit', video)
});

onUnmounted(() => {
    document.removeEventListener('keydown', applyHotkeys);
    document.removeEventListener('mouseup', applyScrubbing);
    document.removeEventListener('mousemove', applyTimelineUpdate);
    document.removeEventListener('fullscreenchange', applyFullScreen);
});
</script>

<style>
@import url('./VideoPlayer.css');
</style>
