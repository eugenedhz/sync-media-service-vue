<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Page } from '@/widgets/Page';
import {
    useGetUserApi,
    useUserStore,
} from '@/entities/User';
import { __BASE_URL__ } from '@/shared/config/environment';
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres } from '@/entities/Media/api/requests';
import { RoomCardList, RoomCard, useGetAllRoomsApi, Room, useGetRoomApi } from '@/entities/Room';
import { Column, Typography, Row, Avatar, Card } from '@/shared/ui';
import { useRouter, useRoute } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { SearchBar } from '@/widgets/SearchBar'
import { useGetAllParticipantsApi } from '@/entities/Participant';

const userStore = useUserStore();
const userApi = useGetUserApi();
const roomsApi = useGetAllRoomsApi();
const getRoomApi = useGetRoomApi();
const participantApi = useGetAllParticipantsApi();

const router = useRouter();
const route = useRoute();

const mediaRows = ref<MediaWithGenres[][] | undefined>([]);
const fetchMedias = async () => {
    try {
        const mediasQueries = [];

        for (let i = 0; i < 4; i++) {
            mediasQueries.push(fetchAllMedias({ limit: 10, offset: i }));
        }

        const response = await Promise.all(mediasQueries);

        for (let i = 0; i < response.length; i++) {
            mediaRows.value?.push(response[i].data);
        }
    } catch (error) {
        console.log(error);
    }
};

const navigateToRoom = (room: Room) => {
    router.push({
        name: Routes.ROOM,
        params: {
            id: room.id
        }
    });
};

const userProfile = ref(false);

onMounted(async () => {
    if (userStore.authData?.username === route.params.username) {
        userProfile.value = true
    } else {
        userProfile.value = false
    }

    await userApi.initiate(undefined, {
        params: {
            username: `${route.params.username}`
        }
    }); 

    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`,
            expand: 'participants'
        }
    });

    await fetchUserCurrentRoom()

    await Promise.all([fetchMedias()]);
});

watch(() => route.params.username, async (newUsername) => {
    if (userStore.authData?.username === route.params.username) {
        userProfile.value = true
    } else {
        userProfile.value = false
    }

    await userApi.initiate(undefined, {
        params: {
            username: newUsername
        }
    });

    await fetchUserCurrentRoom()

    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`,
            expand: 'participants'
        }
    });
});

const handleDeleteRoom = async () => {
    console.log('rerender')
    setTimeout(async () => {
        await roomsApi.initiate(undefined, {
            params: {
                filter_by: `creatorId{==}${userApi.data?.id}`
            }
        });
    }, 100);
}

const fetchUserCurrentRoom = async () => {
    getRoomApi.data = undefined

    await participantApi.initiate(undefined, {
        params: {
            filter_by: `userId{==}${userApi.data?.id}`
        }
    });

    if (participantApi.data && participantApi.data.length !== 0) {
        await getRoomApi.initiate(undefined, {
            params: {
                id: participantApi.data[0].roomId,
                expand: 'participants'
            }
        });
    }

    return getRoomApi.data
}
</script>

<template>
    <div class="background">
        <Page>
            <Column :align="'start'" :gap="'32'" class="padding">
                <SearchBar/>
                    <Card
                        qwartz-primary
                        full-width
                    >
                    <template #header>
                        <Row full-width>
                            <Typography
                                :weight="600"
                                :size="'xl'"
                                v-if="userApi.data?.id !== userStore.authData?.id"
                            >
                                Профиль
                            </Typography>
                            <Typography
                                :weight="600"
                                :size="'xl'"
                                v-if="userApi.data?.id === userStore.authData?.id"
                            >
                                Ваш профиль
                            </Typography>
                        </Row>
                    </template>
                        <Row :align="'stretch'" :gap="'16'" style="margin-bottom: 32px;">
                            <template v-if="userApi?.data">
                                <Row :gap="'32'" full-width>
                                    <Card
                                        :padding="'none'"
                                        style="max-width: 550px;"
                                        full-width
                                    >
                                        <Row
                                            :align="'start'"
                                            :justify="'between'"
                                            :gap="'16'"
                                        >
                                            <div>
                                                <Avatar
                                                    :width="'200'"
                                                    :height="'200'"
                                                    :src="__BASE_URL__ + userApi.data.avatar"
                                                />
                                            </div>
                                            <Column
                                                :align="'start'"
                                                :justify="'start'"
                                                full-width
                                                style="padding-top: 8px;"
                                            >
                                                <Column
                                                    :align="'start'"
                                                    :justify="'start'"
                                                    style="padding-bottom: 16px;"
                                                >
                                                    <Typography
                                                        :size="'xl'"
                                                        :weight="600"
                                                        :align="'center'"
                                                    >
                                                        {{ userApi.data.displayName }}
                                                    </Typography>
                                                    <Typography
                                                        :size="'sm'"
                                                        :weight="400"
                                                        :align="'center'"
                                                        :color="'green'"
                                                    >
                                                        @{{ userApi.data.username }}
                                                    </Typography>
                                                </Column>
                                                <Row
                                                    :align="'start'"
                                                    :justify="'start'"
                                                >
                                                    <template
                                                        v-if="userApi.data.description !== null"
                                                    >
                                                        <Typography
                                                            :size="'md'"
                                                            :weight="500"
                                                            :align="'start'"
                                                            :color="'pale'"
                                                        >
                                                            статус:
                                                        </Typography>
                                                        <Typography
                                                            :size="'md'"
                                                            :weight="500"
                                                            :align="'start'"
                                                        >
                                                            {{ userApi.data.description }}
                                                        </Typography>
                                                    </template>
                                                </Row>
                                            </Column>
                                        </Row>
                                    </Card>
                                    <Card
                                        qwartz-primary
                                        full-width
                                        style="max-height: 200px; height: 100%;"
                                    >
                                    <template #header>
                                        <Row full-width>
                                            <Typography
                                                :weight="600"
                                                :size="'xl'"
                                            >
                                                Сейчас в комнате
                                            </Typography>
                                        </Row>
                                    </template>
                                        <Row :justify="'center'" :align="'center'" full-width full-height style="max-height: 105px;">
                                            <RoomCard :room="getRoomApi.data" v-if="getRoomApi.data" @click="navigateToRoom(getRoomApi.data)"/>
                                            <Typography
                                                :weight="500"
                                                :size="'lg'"
                                                :align="'center'"
                                                :color="'pale'"
                                                v-if="!getRoomApi.data && userApi.data?.id !== userStore.authData?.id"
                                            >
                                                {{ userApi.data?.displayName }} пока никуда не зашёл(
                                            </Typography>

                                            <Typography
                                                :weight="500"
                                                :size="'lg'"
                                                :align="'center'"
                                                :color="'pale'"
                                                v-if="!getRoomApi.data && userApi.data?.id === userStore.authData?.id"
                                            >
                                                вы пока никуда не зашли(
                                            </Typography>
                                        </Row>
                                    </Card>
                                </Row>
                            </template>
                        </Row>
                        <Card full-width>
                            <template #header>
                                <Row full-width>
                                    <Typography
                                        :weight="600"
                                        :size="'xl'"
                                        v-if="userApi.data?.id !== userStore.authData?.id"
                                    >
                                        Созданные комнаты от {{ userApi.data?.displayName }}
                                    </Typography>
                                    <Typography
                                        :weight="600"
                                        :size="'xl'"
                                        v-if="userApi.data?.id === userStore.authData?.id"
                                    >
                                        Ваши комнаты
                                    </Typography>
                                </Row>
                            </template>
                            <div
                                class="ilow-scroll room-overflow"
                                style="width: 100%;"
                                v-if="
                                        roomsApi?.data && roomsApi.data.length > 0
                                    "
                            >
                                <RoomCardList
                                    @room-click="navigateToRoom($event)"
                                    class="padding-left"
                                    :rooms="roomsApi?.data"
                                    :isUserProfile="userProfile"
                                    @deleted-room="handleDeleteRoom"
                                />
                            </div>
                            <Typography
                                :weight="500"
                                :size="'lg'"
                                :align="'center'"
                                :color="'pale'"
                                v-if="
                                    roomsApi.data?.length === 0 && userApi.data?.id !== userStore.authData?.id
                                "
                            >
                                грустно, {{ userApi.data?.displayName }} ещё ничего не добавил(
                            </Typography>
                            <Typography
                                :weight="500"
                                :size="'lg'"
                                :align="'center'"
                                :color="'pale'"
                                v-if="
                                    roomsApi.data?.length === 0 && userApi.data?.id === userStore.authData?.id
                                "
                            >
                                грустно, вы ещё ничего не добавили(
                            </Typography>
                        </Card>
                    </Card>
            </Column>
        </Page>
        <div class="dark">
            <Page>
                <MediaGrid :media-rows="mediaRows"> Недавно добавленные фильмы </MediaGrid>
            </Page>
        </div>
    </div>
</template>

<style scoped lang="css">
@import url('@/app/styles/scrollbar.css');
.background {
    background:  linear-gradient(135deg, #000000, #03228f);
}

.dark {
    background: var(--qwarz-dark-primary);
    border-radius: 20px;
}

.room-overflow {
    overflow: auto;
}

.padding {
    padding: 16px 32px;
    padding-top: 0;
}
</style>
