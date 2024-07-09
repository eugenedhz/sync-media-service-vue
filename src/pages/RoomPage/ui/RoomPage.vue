<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, nextTick, watch } from 'vue';
import { socketService } from '@/shared/api';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/entities/User';
import { PlaylistMedia, useGetAllPlaylistMediaApi } from '@/entities/Media';
import { useGetAllVideoMediaApi } from '@/entities/Video';
import { __BASE_URL__ } from '@/shared/config/environment';
import { Page } from '@/widgets/Page';
import { VideoPlayer } from '@/entities/Video';
import { Input, Card, Typography, Avatar, Row, Column, Image } from '@/shared/ui';
import { Participant } from '@/entities/Participant';

const route = useRoute();
const userStore = useUserStore();
const rootRef = ref(null);
const step = ref<number>();
const ctx = ref();
const canvas = ref<HTMLCanvasElement | null>(null);

const chatWindow = ref<HTMLElement | null>(null);

const message = ref('');
const messages = ref<{ message: string; participant: Participant }[]>([]);

const video = ref<HTMLElement | null>(null);
const currentVideo = ref<PlaylistMedia>();

const socket = socketService.socket;

const roomId = Number(route.params?.id);

socket.on('joined', (participatn) => {
    if (userStore.authData?.id === participatn.userId) {
        socket.emit('requestPlayerState', { roomId });
    }
});

socket.on('sendPlayerStateFromClient', ({ userSID }) => {
    console.log('sendPlayerStateFromClient', userSID);
    socket.emit('sendPlayerStateToUser', {
        userSID,
        currentTime: rootRef.value.video.currentTime,
        isPaused: rootRef.value.video.paused
    });
    console.log('sendPlayerStateToUser');
});

socket.on('error', (e) => console.log(e));

socket.on('syncPlayerState', ({ currentTime, isPaused }) => {
    console.log(currentTime);
    console.log('syncPlayerState');
    rootRef.value.video.currentTime = currentTime;

    if (isPaused) {
        rootRef.value.video.pause();
    } else {
        rootRef.value.video.play();
    }
});

const playlistMediaApi = useGetAllPlaylistMediaApi();
const videoMediaApi = useGetAllVideoMediaApi();

const draw = () => {
    console.log('darw');
    ctx.value.drawImage(
        rootRef.value.video,
        0,
        0,
        canvas.value.width,
        canvas.value.height
    );
};

const drawLoop = () => {
    draw();
    step.value = window.requestAnimationFrame(drawLoop);
};

const drawPause = () => {
    window.cancelAnimationFrame(step.value);
    step.value = undefined;
};

const init = () => {
    console.log('init');
    ctx.value = canvas.value?.getContext('2d');
    ctx.value.filter = 'blur(1px)';

    rootRef.value.video.addEventListener('loadeddata', draw, false);
    rootRef.value.video.addEventListener('seeked', draw, false);
    rootRef.value.video.addEventListener('play', drawLoop, false);
    rootRef.value.video.addEventListener('pause', drawPause, false);
    rootRef.value.video.addEventListener('ended', drawPause, false);
};

const cleanup = () => {
    rootRef.value.video.removeEventListener('loadeddata', draw);
    rootRef.value.video.removeEventListener('seeked', draw);
    rootRef.value.video.removeEventListener('play', drawLoop);
    rootRef.value.video.removeEventListener('pause', drawPause);
    rootRef.value.video.removeEventListener('ended', drawPause);
};

onMounted(async () => {
    socket.emit('join', { roomId });

    await playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${roomId}`
        }
    });

    const mediaId = playlistMediaApi.data?.[0].mediaId;
    await videoMediaApi.initiate(undefined, {
        params: {
            filter_by: `mediaId{==}${mediaId}`
        }
    });
    currentVideo.value = videoMediaApi.data?.[0].source;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQuery.matches) {
        init();
    }
});

onUnmounted(() => {
    socket.emit('leave', { roomId }).disconnect();
    cleanup();
});


const playerInit = (videoRef: HTMLElement) => {
    console.log(videoRef);
};

const timeUpdate = ({
    currentTime,
    isPaused
}: {
    currentTime: number;
    isPaused: boolean;
}) => {
    socket.emit('sendPlayerStateToEveryone', {
        currentTime,
        roomId,
        isPaused
    });
    console.log('sendPlayerStateToEveryone');
};

const playToggle = ({
    currentTime,
    isPaused
}: {
    currentTime: number;
    isPaused: boolean;
}) => {
    socket.emit('sendPlayerStateToEveryone', {
        currentTime,
        roomId,
        isPaused
    });
    console.log('sendPlayerStateToEveryone');
};

const setPlayListMediaToPlayer = (playlistMediaId: number) => {
    console.log(playlistMediaId, 'playlistMediaId');
    socket.emit('setPlaylistMediaToPlayer', { playlistMediaId });
};

socket.on('playlistMediaSettedToPlayer', async (playlistMedia) => {
    await videoMediaApi.initiate(undefined, {
        params: {
            filter_by: `mediaId{==}${playlistMedia.mediaId}`
        }
    });
    currentVideo.value = videoMediaApi.data?.[0].source;
    await playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${roomId}`
        }
    });
    rootRef.value.video.pause();
    rootRef.value.video.currentTime = 0;
});

const submit = (e: Event) => {
    e.preventDefault();
    socket.emit('sendMessage', {
        roomId,
        message: message.value
    });
    console.log('sendMessage');
    message.value = '';
};

socket.on('messageSent', async (msg) => {
    console.log('messageSent');
    messages.value.push(msg);
    await nextTick();

    requestAnimationFrame(() => {
        if (chatWindow.value) {
            chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        }
    });
});
</script>

<template>
    <div class="wr">
        <section class="wrapper">
            <Page>
                <Column :gap="'32'">
                  <Row full-width class="padding">
                        <Input full-width />
                    </Row>
                    <Column full-width :gap="'16'">
                        
                        <div>
                            <VideoPlayer
                                ref="rootRef"
                                :video="video"
                                @player-init="playerInit($event)"
                                @time-update="timeUpdate($event)"
                                @play-toggle="playToggle($event)"
                                :src="
                                    __BASE_URL__ + currentVideo + '?quality=1080p'
                                "
                            >
                            </VideoPlayer>
                        </div>
    
                        <Column full-width>
                            <Row :gap="'16'" :align="'stretch'" style="max-height: 500px;" full-width>
                                <Card :material="'qwartz-primary'" style="flex: 2; ">
                                    <template #header>
                                        <Row full-width>
                                            <Typography :weight="600" :size="'lg'">
                                                Playlist
                                            </Typography>
                                        </Row>
                                    </template>
                                    <Column :align="'stretch'" :gap="'8'" style="overflow-y: auto;">
                                      <template
                                          v-for="playlistMedia in playlistMediaApi?.data"
                                      >
  
                                          <Card :padding="'none'">
                                            <Row
                                              full-width 
                                              :gap="'16'"                                    
                                              class="pointer"
                                              @click="
                                                  setPlayListMediaToPlayer(
                                                      playlistMedia.id
                                                  )
                                              ">
                                            <Image :width="153" :height="73" style="object-fit: cover;" :src="playlistMedia.thumbnail"/>
                                            <Typography :weight="600">{{ playlistMedia.name }} </Typography>
                                          </Row>
                                          </Card>
                                      </template>
                                    </Column>
                                </Card>
                                <Card :material="'qwartz-primary'" style="flex: 1">
                                    <template #header>
                                        <Row full-width>
                                            <Typography :weight="600" :size="'lg'">
                                                Chat
                                            </Typography>
                                        </Row>
                                    </template>
                                    <Column :align="'center'">
                                        <div
                                            ref="chatWindow"
                                            style="
                                                overflow-y: auto;
                                                height: 330px;
                                                width: 100%;
                                                scroll-behavior: smooth;
                                            "
                                        >
                                            <Column
                                                :gap="'16'"
                                                :align="'start'"
                                                full-width
                                            >
                                                <template
                                                    v-for="message in messages"
                                                >
                                                    <Row
                                                        :align="'stretch'"
                                                        :gap="'16'"
                                                        full-width
                                                        :justify="
                                                            message.participant
                                                                .userId ===
                                                            userStore.authData.id
                                                                ? 'end'
                                                                : 'start'
                                                        "
                                                    >
                                                        <template
                                                            v-if="
                                                                !(
                                                                    message
                                                                        .participant
                                                                        .userId ===
                                                                    userStore
                                                                        .authData.id
                                                                )
                                                            "
                                                        >
                                                            <Avatar
                                                                :src="
                                                                    __BASE_URL__ +
                                                                    message
                                                                        .participant
                                                                        .avatar
                                                                "
                                                            />
                                                        </template>
                                                        <Card
                                                            :padding="'sm'"
                                                            :material="
                                                                message.participant
                                                                    .userId ===
                                                                userStore.authData
                                                                    .id
                                                                    ? 'qwartz-inverted'
                                                                    : 'qwartz-secondary'
                                                            "
                                                            style="
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                max-width: 60%;
                                                            "
                                                        >
                                                            <Typography
                                                                :size="'sm'"
                                                                :weight="600"
                                                                :color="
                                                                    message
                                                                        .participant
                                                                        .userId ===
                                                                    userStore
                                                                        .authData.id
                                                                        ? 'inverted'
                                                                        : 'primary'
                                                                "
                                                                >{{
                                                                    message.message
                                                                }}</Typography
                                                            >
                                                        </Card>
                                                        <template
                                                            v-if="
                                                                message.participant
                                                                    .userId ===
                                                                userStore.authData
                                                                    .id
                                                            "
                                                        >
                                                            <Avatar
                                                                :src="
                                                                    __BASE_URL__ +
                                                                    message
                                                                        .participant
                                                                        .avatar
                                                                "
                                                            />
                                                        </template>
                                                    </Row>
                                                </template>
                                            </Column>
                                        </div>
                                    </Column>
                                    <template #footer>
                                        <form @submit="submit">
                                            <Input
                                                :placeholder="'Message..'"
                                                v-model="message"
                                                full-width
                                            />
                                        </form>
                                    </template>
                                </Card>
                            </Row>
                        </Column>
                    </Column>
                </Column>
            </Page>

            <canvas
                width="10"
                ref="canvas"
                height="8"
                aria-hidden="true"
                className="canvas"
                id="js-canvas"
            />
        </section>
    </div>
</template>

<style scoped lang="css">
html {
    background: var(--qwarz-dark-secondary);
}

.wrapper {
    position: relative;
    margin: 0 auto;
    /* box-shadow: inset 0 -10rem 10rem 10rem red; */
    box-shadow: inset 0 -3rem 4rem 4.5rem var(--qwarz-dark-secondary);
    max-height: 900px;
    max-width: 1800px;
}

@media (prefers-reduced-motion: reduce) {
    .canvas {
        display: none !important;
    }
}

.wr {
}

.canvas {
    position: absolute;
    top: -50px;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 1;
}
</style>
