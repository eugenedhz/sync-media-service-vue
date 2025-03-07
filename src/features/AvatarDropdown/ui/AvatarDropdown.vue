<script setup lang="ts">
import { ref, PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { Avatar, Dropdown } from '@/shared/ui';
import { Routes } from '@/shared/consts/router';
import { useUserStore } from '@/entities/User';
import { autoPlacement, offset, useFloating } from '@floating-ui/vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { __BASE_URL__ } from '@/shared/config/environment';
import Logout from '@/shared/assets/icons/logout.svg?component'
import Profile from '@/shared/assets/icons/profile.svg?component'
import Settings from '@/shared/assets/icons/settings.svg?component'

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const items = ref([
    {
        content: '132',
    },
    {
        content: 'sadsa'
    }
]);
export interface DropdownItem {
    disabled?: boolean;
    content?: string;
    href?: string;
}

defineEmits(['select']);
defineProps({
    items: {
        type: Object as PropType<DropdownItem[]>,
        default: [] as PropType<DropdownItem[]>
    },
    trigger: {
        type: String,
        default: 'trigger'
    }
});

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
    middleware: [
        autoPlacement({
            allowedPlacements: ['bottom'],
            crossAxis: true
        }),
    ]
});

const logout = async () => {
    await userStore.logout();
    router.push({ name: Routes.LOGIN })
}

const navigateToProfile = () => {
    if (userStore && userStore.authData) {
        if (route.name === 'room') {
            let routeData = router.resolve({
                name: Routes.PROFILE,
                params: {
                    username: userStore.authData.username
                }
            });
            window.open(routeData.href, '_blank');
        } else {
            router.push({
                name: Routes.PROFILE,
                params: {
                    username: userStore.authData.username
                }
            });
        }
    }
};

const navigateToSettings = () => {
    if (route.name === 'room') {
        let routeData = router.resolve({
            name: Routes.SETTINGS
        });
        window.open(routeData.href, '_blank');
    } else {
        router.push({
            name: Routes.SETTINGS
        });
    }
};

</script>

<template>
    <Menu>
        <div class="button-wrapper">
            <MenuButton ref="reference" class="button">
                <Avatar :src="__BASE_URL__ + userStore?.authData?.avatar"/>
            </MenuButton>
        </div>
        <MenuItems ref="floating" :style="floatingStyles" class="list">
                <MenuItem v-slot="{ active }">
                    <button
                        :class="{ selected: active }"
                        class="item"
                        @click="navigateToProfile()"
                    >
                        <Profile/>
                    </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                    <button
                        :class="{ selected: active }"
                        class="item"
                        @click="navigateToSettings()"
                    >
                        <Settings/>
                    </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                    <button
                        :class="{ selected: active }"
                        class="item"
                        @click="logout()"
                    >
                        <Logout/>
                    </button>
                </MenuItem>

        </MenuItems>
    </Menu>
</template>

<style>
@import url('./AvatarDropdown.css');
</style>