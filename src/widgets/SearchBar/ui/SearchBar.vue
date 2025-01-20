<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';

import { AvatarDropdown } from '@/features/AvatarDropdown';
import Logo from '@/shared/assets/icons/logo.svg?component';
import Notification from '@/shared/assets/icons/notification.svg?component';
import Cross from '@/shared/assets/icons/cross.svg?component';
import Checkmark from '@/shared/assets/icons/checkmark.svg?component';
import Search from '@/shared/assets/icons/search.svg?component';
import { useGetAllGenreApi, Genre } from '@/entities/Genre';
import { User, useGetFriendsRequestsApi, useAddFriendApi, useRejectFriendRequestApi } from '@/entities/User';
import { debounce } from '@/shared/lib/helpers/debounce';
import {
    MediaWithGenres,
    findMedias
} from '@/entities/Media/api/requests';
import { Column, Typography, Row, Input, Card, Tag, Button, Avatar } from '@/shared/ui';
import { MediaGrid } from '@/features/MediaGrid';
import { CreateRoomForm } from '@/features/CreateRoomForm'
import { useRouter, useRoute } from 'vue-router';
import { Routes } from '@/shared/consts/router';
import { __BASE_URL__ } from '@/shared/config/environment';

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue';


const router = useRouter();
const route = useRoute(); 
const isOpen = ref(false);

function setIsOpen(value: boolean) {
    isOpen.value = value;
}

const genreApi = useGetAllGenreApi();
const searchQuery = ref<string>('');
const loadingState = ref<boolean>(true);
const searchResult = ref<MediaWithGenres[]>([]);
const selectedGenres = ref<number[]>([]);
const friendsResuestsApi = useGetFriendsRequestsApi();
const addFriendApi = useAddFriendApi();
const rejectFriendRequestApi = useRejectFriendRequestApi();

onMounted(async () => {
    loadingState.value = true
    await friendsResuestsApi.initiate();
    loadingState.value = false
});

const emit = defineEmits([
    'addMedia',
    'leave',
    'friendAction'
]);

const debouncedFindMedias = debounce(
    async ({
        genreIds,
        filter_by
    }: {
        genreIds: string;
        filter_by: string;
    }) => {
        const response = await findMedias({
            genreIds,
            filter_by,
            expand: 'genres'
        });

        searchResult.value = response.data;
    },
    500
);

const onSelectGenre = (genre: Genre) => {
    const isGenreSelected = selectedGenres.value.find((id) => id === genre.id);
    if (isGenreSelected) {
        selectedGenres.value = selectedGenres.value.filter(
            (id) => id !== genre.id
        );
    } else {
        selectedGenres.value.push(genre.id);
    }
    const genreIds = selectedGenres.value.join(',');

    if (searchQuery.value) {
        debouncedFindMedias({
            genreIds,
            filter_by: `name{~}${searchQuery.value}`
        });
        return;
    }
    if (genreIds.length !== 0) {
        debouncedFindMedias({ genreIds });
    } else {
        searchResult.value = []
    }
};

const onInput = () => {
    if (!searchQuery.value) return;

    if (selectedGenres.value.length) {
        const genreIds = selectedGenres.value.join(',');
        debouncedFindMedias({
            genreIds,
            filter_by: `name{~}${searchQuery.value}`
        });
        return;
    }
    debouncedFindMedias({ filter_by: `name{~}${searchQuery.value}` });
};

const navigateToHome = () => {
    emit('leave')
    router.push({ name: 'home' });
}

const isRoomFormOpen = ref(false);

const roomFormOpen = (value: boolean) => {
    isRoomFormOpen.value = value; 
}

const isFriendsRequestsOpen = ref(false);

const friendsRequestsOpen = (value: boolean) => {
    isFriendsRequestsOpen.value = value;
    friendsResuestsApi.initiate();
}

const showNotification = inject('showNotification') as () => void;

const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    .then(() => {
        showNotification();
    })
}

const openProfile = async (user: User) => {
    friendsRequestsOpen(false)

    router.push({
        name: Routes.PROFILE,
        params: {
            username: user.username
        }
    });
};

const rejectFriend = async (user: User) => {
    await rejectFriendRequestApi.initiate(undefined, {
        params: {
            friend_id: user.id
        }
    });
    await friendsResuestsApi.initiate();
    emit('friendAction')
}

const addFriend = async (user: User) => {
    await addFriendApi.initiate(undefined, {
        params: {
            friend_id: user.id
        }
    });
    await friendsResuestsApi.initiate();
    emit('friendAction')
}

</script>

<template>
    <TransitionRoot appear :show="isRoomFormOpen" as="template">
        <Dialog
            as="div"
            @close="roomFormOpen(false)"
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
                            <CreateRoomForm></CreateRoomForm>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="isFriendsRequestsOpen" as="template">
        <Dialog
            as="div"
            @close="friendsRequestsOpen(false)"
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
                                transition: all;
                                vertical-align: middle;
                            "
                        >
                            <Card :material="'qwartz-primary'" style="height: 100%; max-height: 300px;">
                                <template #header>
                                    <Row full-width>
                                        <Typography
                                            :weight="600"
                                            :size="'md'"
                                        >
                                            Запросы в друзья
                                        </Typography>
                                    </Row>
                                </template>
                                <Column
                                        full-width :align="'stretch'"
                                    >
                                    <Typography
                                        v-if="!loadingState && friendsResuestsApi.data?.length === 0"
                                        :weight="500"
                                        :size="'md'"
                                        :align="'center'"
                                        :color="'pale'"
                                        style="margin-top: 79px;"
                                    >
                                        Пока что никто не хочет дружить с вами ^-^
                                    </Typography>

                                    <div
                                        style="
                                            overflow-y: auto;
                                            height: 200px;
                                        "
                                        class="ilow-scroll"
                                    >
                                        <Column
                                                :align="'stretch'"
                                                :gap="'8'"
                                            >
                                            <template v-for="user in friendsResuestsApi.data" v-if="(friendsResuestsApi && friendsResuestsApi.data)">
                                                <div style="position: relative;">
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
                                                    <Row
                                                        :gap="'4'"
                                                        style="
                                                            position: absolute; 
                                                            bottom: 8px; 
                                                            right: 8px; 
                                                            z-index: 11; 
                                                            border-radius: 8px; 
                                                            padding: 4px;
                                                        "
                                                    >
                                                        <Button
                                                            :variant="'cleared'"
                                                            @click="addFriend(user)"
                                                        >
                                                            <Checkmark class="btn" style="fill: green;" />
                                                        </Button>

                                                        <Button
                                                            :variant="'cleared'"
                                                            @click="rejectFriend(user)"
                                                        >
                                                            <Cross class="btn" style="fill: red;" />
                                                        </Button>
                                                    </Row>
                                                </div>
                                            </template>
                                        </Column>
                                    </div>
                                </Column>
                            </Card>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <Row :gap="'16'" full-width>
        <div @click="navigateToHome()">
            <Logo />
        </div>
        <Input
            @click="setIsOpen(true)"
            placeholder="Поиск..."
            icon-shown
            full-width
        >
            <Search />
        </Input>
        <template v-if="(route.name === 'home' || route.name === 'profile')">
            <Button
                :variant="'blured'"
                @click="roomFormOpen(true)"
                style="width: 226px;"
                :size="'sm'"
            >
                новая комната
            </Button>
        </template>
        <template v-if="(route.name === 'room')">
            <Button
                :variant="'blured'"
                @click="copyToClipboard()"
                style="width: 226px;"
                :size="'sm'"
            >
                ссылка на комнату
            </Button>
        </template>
        <Button
            :variant="'blured'"
            style="width: 80px; border-color: #201919;"
            v-if="route.name !== 'settings'"
            @click="friendsRequestsOpen(true)"
        >
            <Notification style="fill: white;" class="btn" />
            <Typography
                style="position: absolute; top: 7px; right: 12px; color: #ffa563;"
                :size="'sm'"
                :weight="600"
                v-if="friendsResuestsApi && friendsResuestsApi.data && !loadingState"
            >
                {{ friendsResuestsApi.data.length }}
            </Typography>
            <Typography
                style="position: absolute; top: 7px; right: 12px; color: #ffa563;"
                :size="'sm'"
                :weight="600"
                v-if="(!friendsResuestsApi || !friendsResuestsApi.data) && !loadingState"
            >
                0
            </Typography>
        </Button>
        <AvatarDropdown />
    </Row>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog
            as="div"
            @close="setIsOpen(false)"
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
                style="position: fixed; inset: 0; overflow-x: auto"
            >
                <div
                    class="flex min-h-full items-center justify-center p-4 text-center"
                    style="
                        display: flex;
                        min-height: 100%;
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
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                            style="
                                width: 100%;
                                padding-top: 30px;
                                overflow: hidden;
                                transition: all;
                                vertical-align: middle;
                            "
                        >
                            <Card :material="'qwartz-primary'">
                                <Column :gap="'16'" :align="'start'">
                                    <Input
                                        v-model="searchQuery"
                                        @input="onInput"
                                        @click="setIsOpen(true)"
                                        placeholder="Поиск..."
                                        icon-shown
                                        full-width
                                    >
                                        <Search />
                                    </Input>
                                    <Row :gap="'8'">
                                        <template
                                            v-for="genre in genreApi.data"
                                        >
                                            <Tag
                                                @click="onSelectGenre(genre)"
                                                :size="
                                                    selectedGenres.includes(
                                                        genre.id
                                                    )
                                                        ? 'md'
                                                        : 'md-inverted'
                                                "
                                                :style="'cursor: pointer;'"
                                                >{{ genre.name }}</Tag
                                            >
                                        </template>
                                    </Row>
                                    <MediaGrid
                                        :material="'glass'"
                                        :media-rows="[searchResult]"
                                        @add-media="emit('addMedia', $event)"
                                    />
                                </Column>
                            </Card>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<style scoped lang="css">
    @import url('@/app/styles/scrollbar.css');

    .btn {
        transition: filter 0.2s ease;
    }

    .btn:hover {
        filter: brightness(0.8);
    }   

    .btn:active {
        filter: brightness(0.6);
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