<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Page } from '@/widgets/Page';
import {
    useFriendsApi,
    useGetUserApi,
    useUserStore,
    UserLabelList,
    User
} from '@/entities/User';
import { __BASE_URL__ } from '@/shared/config/environment';
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres, findMedias } from '@/entities/Media/api/requests';
import { MediaSwiper } from '@/entities/Media';
import { RoomCardList, useGetAllRoomsApi, Room } from '@/entities/Room';
import { Column, Typography, Row, Avatar, Card } from '@/shared/ui';
import { useRouter, useRoute } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { useGetAllGenreApi } from '@/entities/Genre';
import { SearchBar } from '@/widgets/SearchBar'

const isOpen = ref(true)

function setIsOpen(value: boolean) {
    isOpen.value = value
}

const userStore = useUserStore();
const userApi = useGetUserApi();
const friendsApi = useFriendsApi();
const roomsApi = useGetAllRoomsApi();
const genreApi = useGetAllGenreApi();

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);

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

onMounted(async () => {
    isLoading.value = true;
    await userApi.initiate(undefined, {
        params: {
            username: `${route.params.username}`
        }
    }); 
    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`
        }
    });

    await Promise.all([fetchMedias(), genreApi.initiate()]);

    isLoading.value = false;
});

watch(() => route.params.username, async (newUsername) => {
    isLoading.value = true;

    await userApi.initiate(undefined, {
        params: {
            username: newUsername
        }
    });

    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`
        }
    });

    isLoading.value = false;
});
</script>

<template>
    <template v-if="!isLoading && roomsApi?.data && mediaRows">
        <div class="background">
            <Page>
                <Column :align="'start'" :gap="'32'" class="padding">
                    <SearchBar/>
                    <Card
                        qwartz-primary
                        full-width
                    >
                        <Row :align="'stretch'" :gap="'16'" style="margin-bottom: 32px;">
                            <template v-if="userApi?.data">
                                <Card
                                    :padding="'none'"
                                    style="width: 550px;"
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
                            </template>
                        </Row>
                        <Column :gap="'16'" :align="'start'">
                            <Typography :size="'xl'" :weight="600">
                                Созданные комнаты
                            </Typography>
                            <div class="ilow-scroll room-overflow">
                                <RoomCardList
                                    v-if="
                                        roomsApi?.data && roomsApi.data.length > 0
                                    "
                                    @room-click="navigateToRoom($event)"
                                    class="padding-left"
                                    :rooms="roomsApi?.data"
                                />
                            </div>
                        </Column>
                    </Card>
                </Column>
            </Page>
            <div class="dark">
                <Page>
                    <MediaGrid :media-rows="mediaRows"> Популярное </MediaGrid>
                </Page>
            </div>
        </div>
    </template>
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
    max-width: 1410px;
    overflow: auto;
}

.padding {
    padding: 16px 32px;
    padding-top: 0;
}
</style>
