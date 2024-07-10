<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Page } from '@/widgets/Page';
import {
    useFriendsApi,
    useUserStore,
    UserLabelList,
    User
} from '@/entities/User';
import { __BASE_URL__ } from '@/shared/config/environment';
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres, findMedias } from '@/entities/Media/api/requests';
import { MediaSwiper } from '@/entities/Media';
import { RoomCardList, useGetAllRoomsApi, Room } from '@/entities/Room';
import { Column, Typography, Row } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { useGetAllGenreApi } from '@/entities/Genre';


import { SearchBar } from '@/widgets/SearchBar'

const isOpen = ref(true)

function setIsOpen(value: boolean) {
    isOpen.value = value
}

const userStore = useUserStore();
const friendsApi = useFriendsApi();
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

const fetchFriends = () => {
    if (!userStore?.authData?.id) {
        return;
    }

    friendsApi.initiate(undefined, {
        params: {
            id: userStore?.authData.id
        }
    });
};

const navigateToRoom = (room: Room) => {
    router.push({
        name: Routes.ROOM,
        params: {
            id: room.id
        }
    });
};

const navigateToProfile = (user: User) => {
    router.push({
        name: Routes.PROFILE,
        params: {
            id: user.id
        }
    });
};

onMounted(async () => {
    await Promise.all([fetchMedias(), fetchFriends(), roomsApi.initiate(), genreApi.initiate()]);
});
</script>

<template>
    <template v-if="friendsApi?.data && roomsApi?.data && mediaRows">
        <div class="background">
            <Page>
                <Column :align="'start'" :gap="'32'" class="padding">
                    <SearchBar/>
                    <Row :align="'stretch'" :gap="'16'">
                        <UserLabelList
                            v-if="
                                friendsApi?.data && friendsApi.data.length > 0
                            "
                            @user-click="navigateToProfile($event)"
                            class="ilow-scroll"
                            :users="friendsApi?.data || []"
                            :is-loading="isFriendsIsLoading"
                        />
                        <MediaSwiper :medias="mediaRows?.[0]" />
                    </Row>
                    <Column :gap="'16'" :align="'start'">
                        <Typography :size="'xl'" :weight="600">
                            Rooms
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
                </Column>
            </Page>
        </div>
        <div class="dark">
            <Page>
                <MediaGrid :media-rows="mediaRows"> Hot </MediaGrid>
            </Page>
        </div>
    </template>
</template>

<style scoped lang="css">
@import url('@/app/styles/scrollbar.css');
.background {
    background:  linear-gradient(135deg, #2296ef, #03228f);
}

.dark {
    background: var(--qwarz-dark-primary);
}

.room-overflow {
    max-width: 1440px;
    overflow: auto;
}

.padding {
    padding: 16px 32px;
    padding-top: 0;
}
</style>
