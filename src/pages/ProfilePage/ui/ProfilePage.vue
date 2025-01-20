<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Page } from '@/widgets/Page';
import {
    useGetUserApi,
    useUserStore,
    useFriendsApi,
    User,
    useGetFriendsStatusApi,
    useCancelFriendRequestApi,
    useRejectFriendRequestApi,
    useDeleteFriendApi,
    useAddFriendApi

} from '@/entities/User';
import { __BASE_URL__ } from '@/shared/config/environment';
import { MediaGrid } from '@/features/MediaGrid';
import { fetchAllMedias, MediaWithGenres } from '@/entities/Media/api/requests';
import { RoomCardList, RoomCard, useGetAllRoomsApi, Room, useGetRoomApi } from '@/entities/Room';
import { Column, Typography, Row, Avatar, Card, Button } from '@/shared/ui';
import { useRouter, useRoute } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { SearchBar } from '@/widgets/SearchBar'
import { useGetAllParticipantsApi } from '@/entities/Participant';
import { useGetAllGenreApi } from '@/entities/Genre';
import { UpdateRoomForm } from '@/features/UpdateRoomForm';

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue';

const userStore = useUserStore();
const userApi = useGetUserApi();
const genreApi = useGetAllGenreApi();
const roomsApi = useGetAllRoomsApi();
const getRoomApi = useGetRoomApi();
const participantApi = useGetAllParticipantsApi();
const friendsApi = useFriendsApi();
const friendsStatusApi = useGetFriendsStatusApi(); 
const cancelFriendApi = useCancelFriendRequestApi(); 
const rejectFriendApi = useRejectFriendRequestApi(); 
const deleteFriendApi = useDeleteFriendApi(); 
const addFriendApi = useAddFriendApi(); 

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

const openProfile = async (user: User) => {
    router.push({
        name: Routes.PROFILE,
        params: {
            username: user.username
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

    await friendsApi.initiate(undefined, {
        params: {
            id: userApi.data?.id
        }
    });

    if (!userProfile.value) {
        await friendsStatusApi.initiate(undefined, {
            params: {
                user_id: userApi.data?.id
            }
        })
    }

    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`,
            expand: 'participants'
        }
    });

    await fetchUserCurrentRoom()

    await Promise.all([fetchMedias(), genreApi.initiate()]);
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

    await friendsApi.initiate(undefined, {
        params: {
            id: userApi.data?.id
        }
    }); 

    if (!userProfile.value) {
        await friendsStatusApi.initiate(undefined, {
            params: {
                user_id: userApi.data?.id
            }
        })
    }

    await fetchUserCurrentRoom()

    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`,
            expand: 'participants'
        }
    });
});

const handleDeleteRoom = async (room: Room) => {
    console.log('rerender')
    setTimeout(async () => {
        await roomsApi.initiate(undefined, {
            params: {
                filter_by: `creatorId{==}${userApi.data?.id}`,
                expand: 'participants'
            }
        });
        if (getRoomApi.data?.id === room.id) {
            await fetchUserCurrentRoom()
        }
    }, 200);
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

const updatingRoom = ref<Room>();
const updateFormOpen = ref(false);

const formOpen = (isop: boolean) => {
    updateFormOpen.value = isop
}

const handleUpdateRoom = (room: Room) => {
    updatingRoom.value = room;
    formOpen(true)
}

const handleUpdated = async (room: Room) => {
    formOpen(false)
    await roomsApi.initiate(undefined, {
        params: {
            filter_by: `creatorId{==}${userApi.data?.id}`,
            expand: 'participants'
        }
    });
    if (getRoomApi.data?.id === room.id) {
        await fetchUserCurrentRoom()
    }
}

const searchBarKey = ref(0);

const reloadSearchBar = () => {
    searchBarKey.value += 1; // Changing the key will remount the SearchBar
};

const handleFriendAction = async () => {
    await friendsApi.initiate(undefined, {
        params: {
            id: userApi.data?.id
        }
    }); 
    await friendsStatusApi.initiate(undefined, {
        params: {
            user_id: userApi.data?.id
        }
    })
}

const friendAction = async (action: string = "none") => {
    let isActionCompleted = false;

    if (friendsStatusApi.data?.status === "REQUEST_SENT") {
        await cancelFriendApi.initiate(undefined, {
            params: {
                friend_id: userApi.data?.id
            }
        })
        isActionCompleted = true
    } else if (friendsStatusApi.data?.status === "NO_REQUEST") {
        await addFriendApi.initiate(undefined, {
            params: {
                friend_id: userApi.data?.id
            }
        })
        isActionCompleted = true
    } else if (friendsStatusApi.data?.status === "FRIENDS") {
        await deleteFriendApi.initiate(undefined, {
            params: {
                friend_id: userApi.data?.id
            }
        })
        isActionCompleted = true
    } else if (friendsStatusApi.data?.status === "REQUEST_RECEIVED" && action === "add") {
        await addFriendApi.initiate(undefined, {
            params: {
                friend_id: userApi.data?.id
            }
        })
        isActionCompleted = true
    } else if (friendsStatusApi.data?.status === "REQUEST_RECEIVED" && action === "reject") {
        await rejectFriendApi.initiate(undefined, {
            params: {
                friend_id: userApi.data?.id
            }
        })
        isActionCompleted = true
    }

    if (isActionCompleted = true) {
        reloadSearchBar()
        await friendsApi.initiate(undefined, {
            params: {
                id: userApi.data?.id
            }
        }); 

        await friendsStatusApi.initiate(undefined, {
            params: {
                user_id: userApi.data?.id
            }
        })
    }
}

</script>

<template>
    <div>
        <TransitionRoot appear :show="updateFormOpen" as="template">
            <Dialog
                as="div"
                @close="formOpen(false)"
                class="relative z-10"
                style="position: relative; z-index: 10"
            >
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div
                        class="fixed inset-0 bg-black/25"
                        style="
                            position: fixed;
                            background: rgba(0, 0, 0, 0.45);
                            inset: 0;
                        "
                    />
                </TransitionChild>
                <div
                    class="fixed inset-0 overflow-y-auto"
                    style="position: fixed; inset: 0; overflow-x: auto; top: 25%"
                >
                    <div
                        class="flex min-h-full items-center justify-center p-4 text-center"
                        style="
                            display: flex;
                            justify-items: center;
                            flex-direction: column;
                            align-items: center;
                            text-align: start;
                            justify-content: start;
                        "
                    >
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                class="max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                                style="
                                    width: 100%;
                                    height: 100%;
                                    max-width: 500px;
                                    max-height: 500px;
                                    padding-top: 30px;
                                    overflow: hidden;
                                    transition: all;
                                    vertical-align: middle;
                                "
                            >
                                <div v-if="updatingRoom">
                                    <UpdateRoomForm :room="updatingRoom" @updater="handleUpdated($event)"></UpdateRoomForm>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
    <div class="background">
        <Page>
            <Column :align="'start'" :gap="'32'" class="padding">
                <SearchBar :key="searchBarKey" @friend-action="handleFriendAction"/>
                    <Row :gap="'16'" full-width style="align-items: stretch;">
                        <Card
                            qwartz-primary
                            full-width
                            style="flex: 4;"
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
                                                            v-if="userApi.data.description !== null"
                                                        >
                                                            {{ userApi.data.description }}
                                                        </Typography>
                                                    </Row>

                                                    <Button
                                                        style="
                                                            align-self: flex-end;
                                                            margin-top: 36px;
                                                            margin-right: 16px;
                                                        "
                                                        @click="friendAction"
                                                        v-if="!userProfile && friendsStatusApi.data?.status !== 'REQUEST_RECEIVED'"
                                                    >
                                                        <Typography
                                                            v-if="friendsStatusApi.data?.status === 'NO_REQUEST'"
                                                            :color="'inverted'"
                                                        >
                                                            Добавить в друзья
                                                        </Typography>

                                                        <Typography
                                                            v-if="friendsStatusApi.data?.status === 'FRIENDS'"
                                                            :color="'inverted'"
                                                        >
                                                            Удалить из друзей
                                                        </Typography>

                                                        <Typography
                                                            v-if="friendsStatusApi.data?.status === 'REQUEST_SENT'"
                                                            :color="'inverted'"
                                                        >
                                                            Отменить запрос
                                                        </Typography>
                                                    </Button>

                                                    <Row
                                                        style="
                                                            align-self: center;
                                                            margin-top: 32px;
                                                        "
                                                        v-if="!userProfile && friendsStatusApi.data?.status === 'REQUEST_RECEIVED'"
                                                        :gap="'4'"
                                                    >
                                                        <Button
                                                            @click="friendAction('add')"
                                                        >
                                                            <Typography
                                                                :color="'inverted'"
                                                                :size="'sm'"
                                                            >
                                                                Принять запрос
                                                            </Typography>
                                                        </Button>

                                                        <Button
                                                            @click="friendAction('reject')"
                                                        >
                                                            <Typography
                                                                :color="'inverted'"
                                                                :size="'sm'"
                                                            >
                                                                Отклонить запрос
                                                            </Typography>
                                                        </Button>
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
                                                    Где же {{ userApi.data?.displayName }}??!
                                                </Typography>

                                                <Typography
                                                    :weight="500"
                                                    :size="'lg'"
                                                    :align="'center'"
                                                    :color="'pale'"
                                                    v-if="!getRoomApi.data && userApi.data?.id === userStore.authData?.id"
                                                >
                                                    Вы пока никуда не зашли(
                                                </Typography>
                                            </Row>
                                        </Card>
                                    </Row>
                                </template>
                            </Row>
                            <Card full-width style="height: 190px;">
                                <template #header>
                                    <Row full-width>
                                        <Typography
                                            :weight="600"
                                            :size="'xl'"
                                            v-if="userApi.data?.id !== userStore.authData?.id"
                                        >
                                            Созданные комнаты
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
                                        @deleted-room="handleDeleteRoom($event)"
                                        @update-room="handleUpdateRoom($event)"
                                    />
                                </div>
                                <Row :justify="'center'" :align="'center'" full-width full-height style="max-height: 105px;">
                                    <Typography
                                        :weight="500"
                                        :size="'lg'"
                                        :align="'center'"
                                        :color="'pale'"
                                        v-if="
                                            roomsApi.data?.length === 0 && userApi.data?.id !== userStore.authData?.id
                                        "
                                    >
                                        Грустно, у {{ userApi.data?.displayName }} нет комнат(
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
                                        Грустно, вы ещё ничего не добавили(
                                    </Typography>
                                </Row>
                            </Card>
                        </Card>
                        <Card
                            qwartz-primary
                            full-width
                            style="flex: 1;"
                        >
                            <template #header>
                                <Row full-width :justify="'between'">
                                    <Typography
                                        :weight="600"
                                        :size="'xl'"
                                    >
                                        Друзья
                                    </Typography>

                                    <Typography
                                        :weight="400"
                                        :size="'lg'"
                                        :color="'pale'"
                                        v-if="friendsApi.data"
                                    >
                                        {{ friendsApi.data.length }}
                                    </Typography>

                                    <Typography
                                        :weight="400"
                                        :size="'lg'"
                                        :align="'end'"
                                        :color="'pale'"
                                        v-if="!friendsApi.data"
                                    >
                                        0
                                    </Typography>
                                </Row>
                            </template>

                            <div
                                style="
                                    overflow-y: auto;
                                    height: 421px;
                                "
                                class="ilow-scroll"
                            >
                                <Column
                                        :align="'stretch'"
                                        :gap="'8'"
                                    >
                                    <template v-for="user in friendsApi.data">
                                        <Card
                                            :padding="'none'"
                                            @click="openProfile(user)"
                                            style="cursor: pointer;"
                                            class="participant"
                                        >
                                            <Row full-width :gap="'16'">
                                                <div>
                                                    <Avatar
                                                        :width="'73'"
                                                        :height="'73'"
                                                        :src="
                                                            __BASE_URL__ + user.avatar
                                                        "
                                                    />
                                                </div>

                                                <Typography
                                                    :weight="600"
                                                >
                                                    {{ user.displayName }}
                                                </Typography>
                                            </Row>
                                        </Card>
                                    </template>
                                </Column>
                            </div>
                        </Card>
                    </Row>
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
    background:  linear-gradient(135deg, #000000, #3e0646);
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

.participant {
    transition: filter 0.2s ease;
}

.participant:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.participant:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}
</style>
