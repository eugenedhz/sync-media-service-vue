<script setup lang="ts">
import { ref } from 'vue';

import { AvatarDropdown } from '@/features/AvatarDropdown';
import Logo from '@/shared/assets/icons/logo.svg?component';
import Search from '@/shared/assets/icons/search.svg?component';
import { useGetAllGenreApi, Genre } from '@/entities/Genre';
import { debounce } from '@/shared/lib/helpers/debounce';
import {
    fetchAllMedias,
    MediaWithGenres,
    findMedias
} from '@/entities/Media/api/requests';
import { MediaSwiper } from '@/entities/Media';
import { RoomCardList, useGetAllRoomsApi, Room } from '@/entities/Room';
import { Column, Typography, Row, Input, Card, Tag } from '@/shared/ui';
import { MediaGrid } from '@/features/MediaGrid';
import { RouterLink, useRouter } from 'vue-router';

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription
} from '@headlessui/vue';


const router = useRouter()
const isOpen = ref(false);

function setIsOpen(value: boolean) {
    isOpen.value = value;
}

const genreApi = useGetAllGenreApi();
const searchQuery = ref<string>('');
const searchResult = ref<MediaWithGenres[]>([]);
const selectedGenres = ref<number[]>([]);

const emit = defineEmits([
    'addMedia',
    'leave'
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

    debouncedFindMedias({ genreIds });
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
</script>

<template>
    <Row :gap="'16'" full-width>
        <div @click="navigateToHome()">
            <Logo />
        </div>
        <Input
            @click="setIsOpen(true)"
            placeholder="Search..."
            icon-shown
            full-width
        >
            <Search />
        </Input>
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
                        background: rgba(0, 0, 0, 0.25);
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
                                max-width: 1510px;
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
                                        placeholder="Search..."
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
