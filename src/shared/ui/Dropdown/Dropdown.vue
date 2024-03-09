<script setup lang="ts">
import { autoPlacement, offset, useFloating } from '@floating-ui/vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { ref } from 'vue';

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
    middleware: [
        autoPlacement({
            allowedPlacements: ['left-start', 'right-start'],
            crossAxis: true
        }),
        offset(10)
    ]
});
</script>

<template>
    <Menu>
        <MenuButton ref="reference" class="button">720px</MenuButton>
        <MenuItems ref="floating" :style="floatingStyles" class="list">
            <MenuItem v-slot="{ active }" class="item">
                <div :class="{ selected: active }" href="/account-settings">
                    240px
                </div>
            </MenuItem>
            <MenuItem v-slot="{ active }" class="item">
                <div :class="{ selected: active }" href="/account-settings">
                    360px
                </div>
            </MenuItem>
            <MenuItem v-slot="{ active }" class="item">
                <div :class="{ selected: active }" href="/account-settings">
                    720px
                </div>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>

<style lang="css" scoped>
@import url('./Dropdown.css');
</style>
