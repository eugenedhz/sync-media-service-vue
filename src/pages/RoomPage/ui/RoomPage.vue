<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick, provide } from 'vue'; 
import { socketService } from '@/shared/api';
import { useRoute, useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { useUserStore, useGetUserApi } from '@/entities/User';
import {
    useGetAllPlaylistMediaApi,
    Media,
    PlaylistMedia
} from '@/entities/Media';
import { useGetAllParticipantsApi } from '@/entities/Participant';
import { useGetRoomApi } from '@/entities/Room';
import { useGetAllVideoMediaApi } from '@/entities/Video';
import { __BASE_URL__ } from '@/shared/config/environment';
import { Page } from '@/widgets/Page';
import { VideoPlayer } from '@/entities/Video';
import {
    Input,
    Card,
    Typography,
    Avatar,
    Row,
    Column,
    Image
} from '@/shared/ui';
import { Participant } from '@/entities/Participant';
import { SearchBar } from '@/widgets/SearchBar';
import Button from '@/shared/ui/Button/Button.vue';
import Delete from '@/shared/assets/icons/delete.svg?component';

const route = useRoute();
const userStore = useUserStore();
const rootRef = ref<{ video: HTMLVideoElement } | null>(null);
const step = ref<number>();
const ctx = ref();
const canvas = ref<HTMLCanvasElement | null>(null);

const chatWindow = ref<HTMLElement | null>(null);

const message = ref('');
const messages = ref<{ message: string; participant: Participant }[]>([]);
const participants = ref<{ participant: Participant; additional: string }[]>([]);

const video = ref<HTMLElement | null>(null);
const currentVideo = ref<string>('');

const getRoomApi = useGetRoomApi();
const getUserApi = useGetUserApi();

socketService.setup();
const socket = socketService.socket;

socket.on('connect', () => {
    console.log('connected')
});

socket.on('disconnect', () => {
    isYouLeft.value = true
    if (rootRef.value) {
        rootRef.value.video.pause();
    }
});

socket.on('joined', (participant) => {
    if (userStore.authData?.id === participant.userId) {
        socket.emit('requestPlayerState', { roomId: Number(route.params.id) });
        participants.value.push({ participant: participant, additional: '(вы)'});
    } else {
        let add = '';
        if (getRoomApi.data?.creatorId === participant.userId){
            add = '(создатель)'
        }
        participants.value.push({ participant: participant, additional: add});
    }
});

socket.on('left', (participant) => {
    participants.value.forEach((item, index) => {
        if (item.participant.id === participant.id) {
            participants.value.splice(index, 1);
        }
    });
})

socket.on('sendPlayerStateFromClient', ({ userSID }) => {
    console.log('sendPlayerStateFromClient', userSID);
    socket.emit('sendPlayerStateToUser', {
        userSID,
        currentTime: rootRef.value?.video.currentTime!,
        isPaused: rootRef.value?.video.paused!
    });
    console.log('sendPlayerStateToUser');
});

socket.on('error', (e) => console.log(e));

var isPausedVal = true 

socket.on('syncPlayerState', ({ currentTime, isPaused }) => {
    if (rootRef.value) {
        rootRef.value.video.currentTime = currentTime;
        isPausedVal = isPaused
        if (isPaused) {
            rootRef.value.video.pause();
        } else {
            rootRef.value.video.play();
        }
    }
});

const isRoomClosed = ref(false);
const isYouLeft = ref(false);

socket.on('roomDeleted', () => {
    isRoomClosed.value = true;
    if (rootRef.value) {
        rootRef.value.video.pause();
    }
});

const playlistMediaApi = useGetAllPlaylistMediaApi();
const videoMediaApi = useGetAllVideoMediaApi();
const participantsApi = useGetAllParticipantsApi();
const drawn = ref(false)

const draw = () => {
    ctx.value.drawImage(
        rootRef.value?.video,
        0,
        0,
        canvas.value?.width,
        canvas.value?.height
    );
};

const drawLoop = () => {
    draw();
    step.value = window.requestAnimationFrame(drawLoop);
};

const drawPause = () => {
    window.cancelAnimationFrame(step.value!);
    step.value = undefined;
};

const init = () => {
    ctx.value = canvas.value?.getContext('2d');
    ctx.value.filter = 'blur(1px)';

    rootRef.value?.video.addEventListener('loadeddata', draw, false);
    rootRef.value?.video.addEventListener('seeked', draw, false);
    rootRef.value?.video.addEventListener('play', drawLoop, false);
    rootRef.value?.video.addEventListener('pause', drawPause, false);
    rootRef.value?.video.addEventListener('ended', drawPause, false);
};

const cleanup = () => {
    if (rootRef.value) {
        rootRef.value.video.removeEventListener('loadeddata', draw);
        rootRef.value.video.removeEventListener('seeked', draw);
        rootRef.value.video.removeEventListener('play', drawLoop);
        rootRef.value.video.removeEventListener('pause', drawPause);
        rootRef.value.video.removeEventListener('ended', drawPause);
    }
};

function truncate(text: string, length: number) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

const getCreatorApi = useGetUserApi();


onMounted(async () => {
    socket.emit('join', { roomId: Number(route.params.id) });

    await getRoomApi.initiate(undefined, {
        params: {
            id: `${route.params.id}`
        }
    }); 

    await getCreatorApi.initiate(undefined, {
        params: {
            id: `${getRoomApi.data?.creatorId}`
        }
    });

    await participantsApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${route.params.id}`
        }
    });

    participantsApi.data?.forEach(participant => {
        if (participant.userId !== userStore.authData?.id) {
            let add = '';
            if (getRoomApi.data?.creatorId === participant.userId){
                add = '(создатель)'
            }
            participants.value.push({ participant: participant, additional: add });
        }
    });;

    await playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${route.params.id}`
        }
    });

    const mediaId = playlistMediaApi.data?.[0].mediaId;
    currentMedia = playlistMediaApi.data?.[0]
    await videoMediaApi.initiate(undefined, {
        params: {
            filter_by: `mediaId{==}${mediaId}`
        }
    });
    currentVideo.value = videoMediaApi.data?.[0].source!;
    setTimeout(async () => {
        if (currentVideo.value && !isPausedVal && rootRef.value) {
            rootRef.value.video.play();
        }
    }, 200)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQuery.matches) {
        init();
    }
});



onBeforeUnmount(() => {
    socket.off('joined');
    socket.off('playlistMediaSettedToPlayer');
    socket.off('error');
    socket.off('sendPlayerStateFromClient');
    socket.off('playlistMediaAdded');
    socket.off('messageSent');
    socket.off('syncPlayerState')
    socket.off('left')
    socket.off('roomDeleted')
    if (route.params?.id) socket.emit('leave', { roomId: Number(route.params.id) })
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
        roomId: Number(route.params.id),
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
        roomId: Number(route.params.id),
        isPaused
    });
    console.log('sendPlayerStateToEveryone');
};

const setPlayListMediaToPlayer = (playlistMediaId: number) => {
    socket.emit('setPlaylistMediaToPlayer', { playlistMediaId });
};

const deletePlaylistMedia = (playlistMediaId: number) => {
    socket.emit('deletePlaylistMedia', { playlistMediaId });
};

var currentMedia: (PlaylistMedia | undefined)

socket.on('playlistMediaSettedToPlayer', async (playlistMedia) => {
    currentMedia = playlistMedia

    await videoMediaApi.initiate(undefined, {
        params: {
            filter_by: `mediaId{==}${playlistMedia.mediaId}`
        }
    });
    currentVideo.value = videoMediaApi.data?.[0].source!;
    await playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${route.params.id}`
        }
    });

    if (rootRef.value) {
        rootRef.value.video.pause();
        rootRef.value.video.currentTime = 0;
    }
});

const submit = (e: Event) => {
    e.preventDefault();
    socket.emit('sendMessage', {
        roomId: Number(route.params.id),
        message: message.value
    });
    message.value = '';
};

socket.on('messageSent', async (msg) => {
    messages.value.push(msg);
    await nextTick();

    requestAnimationFrame(() => {
        if (chatWindow.value) {
            chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        }
    });
});

socket.on('playlistMediaAdded', () => {
    playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${route.params.id}`
        }
    });
});

socket.on('playlistMediaDeleted', async () => {
    await playlistMediaApi.initiate(undefined, {
        params: {
            filter_by: `roomId{==}${route.params.id}`
        }
    });
    let iscurrent = true
    if (currentMedia && playlistMediaApi.data?.length !== 0) {
        iscurrent = playlistMediaApi.data?.[0].mediaId === currentMedia.mediaId
    }

    if (!iscurrent || playlistMediaApi.data?.length === 0) {
        if (playlistMediaApi.data?.length !== 0 && playlistMediaApi.data) {
            console.log(playlistMediaApi.data)
            currentMedia = playlistMediaApi.data[0]

            await videoMediaApi.initiate(undefined, {
                params: {
                    filter_by: `mediaId{==}${currentMedia.mediaId}`
                }
            });

            currentVideo.value = videoMediaApi.data?.[0].source!;
            await playlistMediaApi.initiate(undefined, {
                params: {
                    filter_by: `roomId{==}${route.params.id}`
                }
            });
        } else {
            currentVideo.value = ''
        }
        if (rootRef.value) {
                console.log('stop')
                rootRef.value.video.pause();
                rootRef.value.video.currentTime = 0;
            }
    }
});

const addPlaylistMedia = (media: Media) => {
    socket.emit('addPlaylistMedia', { roomId: Number(route.params.id), mediaId: media.id });
};
const onLeave = () => {
    socket.emit('leave', { roomId: Number(route.params.id) })
}

const router = useRouter();

const openProfile = async (participant: Participant) => {
    await getUserApi.initiate(undefined, {
        params: {
            id: `${participant.userId}`
        }
    }); 
    if (getUserApi && getUserApi.data) {
        let routeData = router.resolve({
            name: Routes.PROFILE,
            params: {
                username: getUserApi.data.username
            }
        });
        window.open(routeData.href, '_blank');
    }
};


const navigateToCreator = async () => {
    let routeData = router.resolve({
        name: Routes.PROFILE,
        params: {
            username: getCreatorApi.data?.username
        }
    });
    window.open(routeData.href, '_blank');
}


const showNotif = ref(false);

const showNotification = () => {
    showNotif.value = true;
    setTimeout(() => {
        showNotif.value = false;
    }, 2000);
};

provide('showNotification', showNotification);

const navigateToHome = () => {
    router.push({
        name: Routes.HOME
    })
}

</script>

<template>
    <template v-if="isRoomClosed">
        <div
            class="fixed inset-0 bg-black/25"
            style="
                position: fixed;
                background: rgba(0, 0, 0, 0.45);
                inset: 0;
                z-index: 999;
            "
        />
        <Card
            full-width
            full-height
            style="
                max-width: 480px;
                max-height: 270px;
                height: 100%;
                position: fixed;
                overflow-x: auto;
                inset: 30% 0 0 36%;
                z-index: 1000;
            "
        >
            <Column :align="'center'" :justify="'center'" full-width full-height style="max-height: 260px; gap: 64px">
                <Typography :size="'lg'" :weight="600" :align="'center'">
                    Комната удалена создателем
                </Typography>

                <Button @click="navigateToHome" full-width>
                    ОК
                </Button>
            </Column>
        </Card>
    </template>
    <template v-if="isYouLeft">
        <div
            class="fixed inset-0 bg-black/25"
            style="
                position: fixed;
                background: rgba(0, 0, 0, 0.45);
                inset: 0;
                z-index: 999;
            "
        />
        <Card
            full-width
            full-height
            style="
                max-width: 480px;
                max-height: 270px;
                height: 100%;
                position: fixed;
                overflow-x: auto;
                inset: 30% 0 0 36%;
                z-index: 1000;
            "
        >
            <Column :align="'center'" :justify="'center'" full-width full-height style="max-height: 260px; gap: 64px">
                <Typography :size="'lg'" :weight="600" :align="'center'">
                    Соединение прервано, возможно вы зашли в другую комнату
                </Typography>

                <Button @click="navigateToHome" full-width>
                    ОК
                </Button>
            </Column>
        </Card>
    </template>
    <Card v-if="showNotif" class="notification">
        <Typography :size="'sm'" :weight="400" :color="'pale'">
            Ссылка на комнату скопирована
        </Typography>
    </Card>
    <div class="wr">
        <section class="wrapper">
            <Page>
                <Column :align="'start'" :gap="'32'" class="padding">
                    <SearchBar @add-media="addPlaylistMedia($event)" @leave="onLeave()"/>
                </Column>
                <Column :gap="'32'">
                    <Column full-width :gap="'16'">
                        <div>
                            <VideoPlayer
                                ref="rootRef"
                                :video="video"
                                @player-init="playerInit($event)"
                                @time-update="timeUpdate($event)"
                                @play-toggle="playToggle($event)"
                                :src="
                                    __BASE_URL__ +
                                    currentVideo +
                                    '?quality=1080p'
                                "
                            >
                            </VideoPlayer>
                        </div>
                        <Column full-width>
                            <Row :gap="'16'" :align="'stretch'" full-width>
                                <Card
                                    :material="'qwartz-primary'"
                                    style="flex: 1"
                                    width="'30'"
                                >
                                    <template #header>
                                        <Row full-width :justify="'between'">
                                            <Typography
                                                :weight="600"
                                                :size="'lg'"
                                            >
                                                Участники
                                            </Typography>

                                            <Button
                                                :variant="'cleared'"
                                                @click="navigateToCreator"
                                                square
                                            >
                                                <Typography
                                                    :weight="500"
                                                    :color="'pale'"
                                                    class="save-icon"
                                                    :size="'md'"
                                                    style="cursor: pointer;"
                                                >
                                                    создатель
                                                </Typography>
                                            </Button>
                                        </Row>
                                    </template>
                                    <Column
                                        full-width :align="'stretch'"
                                    >
                                        <div
                                            style="
                                                overflow-y: auto;
                                                height: 400px;
                                            "
                                            class="ilow-scroll"
                                        >
                                            <Column
                                                :align="'stretch'"
                                                :gap="'8'"
                                            >
                                                <template
                                                    v-for="participant in participants"
                                                >
                                                    <Card
                                                        :padding="'none'"
                                                        @click="openProfile(participant.participant)"
                                                        style="cursor: pointer;"
                                                        class="participant"
                                                    >
                                                        <Row full-width :gap="'16'">
                                                            <div>
                                                                <Avatar
                                                                    :width="'73'"
                                                                    :height="'73'"
                                                                    :src="
                                                                        __BASE_URL__ +
                                                                        participant
                                                                            .participant
                                                                            .avatar
                                                                    "
                                                                />
                                                            </div>
                                                            <Row full-width>
                                                            <Typography
                                                                :weight="600"
                                                            >
                                                                {{ participant.participant.name }}
                                                            </Typography>
                                                            <Typography
                                                                :weight="400"
                                                                :color="'green'"
                                                            >
                                                                {{ participant.additional }}
                                                            </Typography>
                                                            </Row>
                                                        </Row>
                                                    </Card>
                                                </template>
                                            </Column>
                                        </div>
                                    </Column>
                                </Card>
                                <Card
                                    :material="'qwartz-primary'"
                                    style="flex: 2"
                                >
                                    <template #header>
                                        <Row full-width>
                                            <Typography
                                                :weight="600"
                                                :size="'lg'"
                                            >
                                                Плейлист
                                            </Typography>
                                        </Row>
                                    </template>
                                    <Column full-width :align="'stretch'">
                                        <div
                                            style="
                                                overflow-y: auto;
                                                height: 400px;
                                            "
                                            class="ilow-scroll"
                                        >
                                            <Column
                                                :align="'stretch'"
                                                :gap="'8'"
                                            >
                                                <template
                                                    v-for="playlistMedia in playlistMediaApi?.data"
                                                >
                                                    <Card :padding="'none'" class="participant" style="cursor: pointer; position: relative;">
                                                        <Button
                                                            :variant="'cleared'"
                                                            @click="
                                                                deletePlaylistMedia(
                                                                    playlistMedia.id
                                                                )
                                                            "
                                                            class="right-up"
                                                        >
                                                            <Delete class="default-button"/>
                                                        </Button>
                                                        <Row
                                                            full-width
                                                            :gap="'16'"
                                                            @click="
                                                                setPlayListMediaToPlayer(
                                                                    playlistMedia.id
                                                                )
                                                            "
                                                        >
                                                            <Image
                                                                :width="153"
                                                                :height="73"
                                                                style="
                                                                    object-fit: cover;
                                                                "
                                                                :src="
                                                                    playlistMedia.thumbnail
                                                                "
                                                            />
                                                            <Typography
                                                                :weight="600"
                                                                >{{
                                                                    playlistMedia.name
                                                                }}
                                                            </Typography>
                                                        </Row>
                                                    </Card>
                                                </template>
                                            </Column>
                                        </div>
                                    </Column>
                                </Card>
                                <Card
                                    :material="'qwartz-primary'"
                                    style="flex: 1"
                                >
                                    <template #header>
                                        <Row full-width>
                                            <Typography
                                                :weight="600"
                                                :size="'lg'"
                                            >
                                                Чат
                                            </Typography>
                                        </Row>
                                    </template>
                                    <Column :align="'center'">
                                        <div
                                            ref="chatWindow"
                                            class="ilow-scroll"
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
                                                            userStore!.authData!
                                                                .id
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
                                                                    userStore!
                                                                        .authData!
                                                                        .id
                                                                )
                                                            "
                                                        >
                                                            <Column>
                                                                <div>
                                                                    <Avatar
                                                                        :src="
                                                                            __BASE_URL__ +
                                                                            message
                                                                                .participant
                                                                                .avatar
                                                                        "
                                                                        class="participant"
                                                                        @click="openProfile(message.participant)"
                                                                        style="cursor: pointer;"
                                                                    />
                                                                </div>
                                                                <Typography
                                                                    :weight="400"
                                                                    :size="'sm'"
                                                                    :color="'pale'"
                                                                >
                                                                    {{ truncate(message
                                                                            .participant
                                                                            .name, 5
                                                                        )
                                                                    }}
                                                                </Typography>
                                                            </Column>
                                                        </template>
                                                        <Card
                                                            :padding="'sm'"
                                                            :material="
                                                                message
                                                                    .participant
                                                                    .userId ===
                                                                userStore!
                                                                    .authData!.id
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
                                                                    userStore!
                                                                        .authData!
                                                                        .id
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
                                                                message
                                                                    .participant
                                                                    .userId ===
                                                                userStore!
                                                                    .authData!.id
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
                                                :placeholder="'Сообщение..'"
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
.default-button {
    fill: white; /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.default-button:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.default-button:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}

.right-up {
    position: absolute;
    top: 15px;
    right: 0;
    max-width: 54px;
    transform: translate(0, 0);
}

.padding {
    padding: 16px 32px;
    padding-top: 0;
}

.save-icon {
    fill: white; /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.save-icon:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.save-icon:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}

.participant {
    transition: filter 0.2s ease;
}

.participant:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.participant:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}

.notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInOut 2s forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(20px); /* Начальная позиция ниже */
  }
  10% {
    opacity: 1;
    transform: translateY(0px);
  }
  90% {
    opacity: 1; /* Уведомление остается видимым */
    transform: translateY(0px);
  }
  100% {
    opacity: 0; /* Исчезновение без перемещения */
    transform: translateY(0px);
  }
}

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
