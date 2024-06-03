<template>
    {{ counter.doubleCount }}
    <hr />
    <Button :type="'submit'" @click="counter.increment()">SIGN UP</Button>
    <hr />
    <Button :variant="'outlined'" @click="counter.increment()">SIGN UP</Button>
    <hr />
    <Button :variant="'blured'" @click="counter.increment()">SIGN UP</Button>
    <hr />
    <Button disabled @click="counter.increment()">SIGN UP</Button>
    <hr />
    <Button :variant="'cleared'" @click="counter.increment()">SIGN UP</Button>
    <hr />
    <div>
        <Tag> Arthous </Tag>
    </div>
    <div style="display: flex; justify-content: space-between">
        <Dropdown
            :items="[
                {
                    content: 'disabled',
                    disabled: true,
                    href: 'https://www.youtube.com/'
                },
                {
                    content: 'enabled',
                    href: 'https://www.youtube.com/'
                },
                {
                    content: 'disabled',
                    disabled: true,
                },
                {
                    content: 'enabled',
                },
            ]"
            @select="(item) => console.log(item)"
        ></Dropdown>
        <Dropdown></Dropdown>
    </div>
    <div>
        <Input v-model="checkboxes.input" :placeholder="'Search..'" icon-shown @icon-click="() => console.log(input)">
            <Sample/>
        </Input>
        {{ checkboxes.inp }}
        <Button full-width>Sign in</Button>
    </div>
    <Switch v-model="enabled" :value="'valuye'" />
    <div style="display:flex">
        <Checkbox
            v-for="checkbox in checkboxes.checkbox"
            :key="checkbox.name"
            :name="checkbox.name"
            :checked="checkbox.checked"
            @check="checkboxes.check(checkbox)"
        />
    </div>
    <div style="display: flex">
        <Row :gap="'32'" full-width>
            <Card :width="'100px'" height="100px" :material="'qwartz-primary'" />
            <Card :width="'100px'" height="100px" :material="'qwartz-secondary'" framed />
            <Card :width="'100px'" height="100px"></Card>
            <Card :width="'100px'" height="100px" framed />
        </Row>
        <Column>
            <Card :material="'qwartz-primary'" framed />
            <Card :material="'qwartz-secondary'" framed />
            <Card></Card>
            <Card framed />
        </Column>
    </div>
    <Avatar
        :src="'http://i07.fotocdn.net/s124/e002875bda4ec088/gallery_xl/2825242466.jpg'"
    />
    <Avatar :src="'https://v1.popcornnews.ru/k2/news/1200/upload/wcTTcx.jpg'" />
    <Avatar
        :src="'https://i.pinimg.com/originals/75/0c/2b/750c2bf45eda818d53320b5607df7017.jpg'"
    />
    <Avatar :src="'https://w.wallhaven.cc/full/95/wallhaven-95vk3w.png'" />
    <Typography :weight="600" :as="'p'" :align="'center'" :size="'xl'" uppercase>dsad</Typography>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useCheckboxStore } from '../model/checkboxStore';
import { useCounterStore } from '../model/counterStore';

import Sample from '@/shared/assets/icons/sample.svg?component';
import {
    Button,
    Tag,
    Dropdown,
    Input,
    Switch,
    Checkbox,
    Card,
    Avatar,
    Row,
    Column,
    Typography
} from '@/shared/ui';

const counter = useCounterStore();
const checkboxes = useCheckboxStore();

const enabled = ref(false);
const input = ref('input');

</script>

<style>
@import './HomePage';
</style>
../model/exampleStore
