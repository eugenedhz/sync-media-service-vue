<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Page } from '@/widgets/Page';
import { useFriendsApi, useUserStore, UserLabelList, User } from '@/entities/User';
import { __BASE_URL__ } from '@/shared/config/environment'
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres } from '@/entities/Media/api/requests';
import { MediaSwiper } from '@/entities/Media';
import { RoomCardList, useGetAllRoomsApi, Room } from '@/entities/Room';
import { Column, Typography, Row } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { getRouteRoom, Routes } from '@/shared/consts/router';


const userStore = useUserStore()
const friendsApi = useFriendsApi();
const roomsApi = useGetAllRoomsApi();
const isFriendsIsLoading = ref<boolean>(false);

const router = useRouter();

const mediaRows = ref<MediaWithGenres[][] | undefined>([]);
const fetchMedias = async () => {
    try {
        isFriendsIsLoading.value = true
        const mediasQueries = [];

        for (let i = 0; i < 4; i++) {
            mediasQueries.push(fetchAllMedias({ limit: 10, offset: i }))
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
}

const fetchFriends = () => {
    if (!userStore?.authData?.id) {
        return;
    }

    friendsApi.initiate(undefined, {
        params: {
            id: userStore?.authData.id
        }
    })
}

const navigateToRoom = (room: Room) => {
    router.push({ name: Routes.ROOM, params: {
            id: room.id
        }  
    })
}

const navigateToProfile = (user: User) => {
    router.push({ name: Routes.PROFILE, params: {
            id: user.id
        }  
    })
}

onMounted(async() => {
    await Promise.all([
    fetchMedias(),
    fetchFriends(),
    roomsApi.initiate()
    ])
})


</script>

<template>
    <template v-if="friendsApi?.data && roomsApi?.data && mediaRows">
    <div class="background">
        <Page >
                <Column :align="'start'" :gap="'16'" class="padding">
                    <Row :align="'stretch'" :gap="'16'">
                        <UserLabelList 
                            @user-click="navigateToProfile($event)"
                            style="  overflow-y: scroll;" 
                            :users="friendsApi?.data || []"
                            :is-loading="isFriendsIsLoading"
                        />
                        <MediaSwiper :medias="mediaRows?.[0]"/>
                    </Row>
                    <Column :gap="'16'" :align="'start'">
                        <Typography :size="'xl'" :weight="600">Rooms</Typography>
                        <div class="room-overflow">
                            <RoomCardList 
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
                <MediaGrid :media-rows="mediaRows">
                    Hot
                </MediaGrid>
            </Page>
    </div>
</template>

</template>

<style scoped lang="css">
.background {
    background: linear-gradient(108deg, #ff7a00 0%, #b82020 100%) no-repeat;
}

.dark {
    background: var(--qwarz-dark-primary);
}

.room-overflow {
    max-width: 1440px;
    overflow: auto;
}

.padding {
    padding: 32px;
}
</style>
