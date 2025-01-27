<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Page } from '@/widgets/Page';
import { __BASE_URL__ } from '@/shared/config/environment';
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres, findMedias } from '@/entities/Media/api/requests';
import { MediaSwiper } from '@/entities/Media';
import { RoomCardList, useGetAllRoomsApi, Room } from '@/entities/Room';
import { Column, Typography, Card } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { useGetAllGenreApi } from '@/entities/Genre';


import { SearchBar } from '@/widgets/SearchBar'

const roomsApi = useGetAllRoomsApi();
const genreApi = useGetAllGenreApi();
const isFriendsIsLoading = ref<boolean>(false);

const router = useRouter();

const mediaRows = ref<MediaWithGenres[][] | undefined>([]);
const fetchMedias = async () => {
    try {
        isFriendsIsLoading.value = true;
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
    } finally {
        isFriendsIsLoading.value = false;
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
    await Promise.all([fetchMedias(), roomsApi.initiate(undefined, {params: {limit: 20, offset: 0, expand: 'participants'}}), genreApi.initiate()]);
});
</script>

<template>
    <template v-if="roomsApi?.data && mediaRows">
        <div class="background">
            <Page>
                <Column :align="'start'" :gap="'32'" class="padding">
                    <SearchBar/>
                    <MediaSwiper :medias="mediaRows?.[0]" />
                    <Card full-width>
                        <template #header>
                            <Row full-width>
                                <Typography
                                    :weight="600"
                                    :size="'xl'"
                                    :huina="'xl'"
                                    :novaya="'sm'"
                                >
                                    Недавно добавленные комнаты
                                </Typography>
                            </Row>
                        </template>
                        <div class="ilow-scroll room-overflow" style="width: 100%;">
                            <RoomCardList
                                v-if="
                                    roomsApi?.data && roomsApi.data.length > 0
                                "
                                @room-click="navigateToRoom($event)"
                                class="padding-left"
                                :rooms="roomsApi?.data"
                            />
                        </div>
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
</template>

<style scoped lang="css">
@import url('@/app/styles/scrollbar.css');
.background {
    background:  linear-gradient(135deg, #000000, #240c4d);
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
