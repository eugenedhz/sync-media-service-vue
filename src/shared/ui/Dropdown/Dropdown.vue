<script setup lang="ts">
import { autoPlacement, offset, useFloating } from '@floating-ui/vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { PropType, ref } from 'vue';

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
            allowedPlacements: ['left-start', 'right-start', 'bottom'],
            crossAxis: true
        }),
        offset(10)
    ]
});
</script>

<template>
    <Menu>
        <MenuButton ref="reference" class="button">{{ trigger }}</MenuButton>
        <MenuItems ref="floating" :style="floatingStyles" class="list">
            <template v-for="item in items" :key="item.content">
                <template v-if="item?.href">
                    <MenuItem
                        v-slot="{ active }"
                        :as="'a'"
                        :href="!item?.disabled ? item.href : '/'"
                        :disabled="item?.disabled"
                    >
                        <button
                            :disabled="item?.disabled"
                            :class="{ selected: !item?.disabled && active }"
                            class="item"
                            type="button"
                        >
                            {{ item.content }}
                        </button>
                    </MenuItem>
                </template>
                <template v-else>
                    <MenuItem v-slot="{ active }" :disabled="item?.disabled">
                        <button
                            :class="{ selected: active }"
                            class="item"
                            :disabled="item?.disabled"
                            @click="$emit('select', item)"
                        >
                            {{ item.content }}
                        </button>
                    </MenuItem>
                </template>
            </template>
        </MenuItems>
    </Menu>
</template>

<style lang="css" scoped>
@import url('./Dropdown.css');
</style>
