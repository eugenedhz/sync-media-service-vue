<template>
    {{ counter.doubleCount }}
    <hr>
    <Button  @click="counter.increment()">SIGN UP</Button>
    <hr>
    <Button  :variant="'outlined'" @click="counter.increment()">SIGN UP</Button>
    <hr>
    <Button  :variant="'blured'" @click="counter.increment()">SIGN UP</Button>
    <hr>
    <Button  disabled @click="counter.increment()">SIGN UP</Button>
    <hr>
    <Button  :variant="'cleared'" @click="counter.increment()">SIGN UP</Button>
    <hr>
    <div>
        <Tag>
            Arthous
        </Tag>
    </div>
    <div style="display: flex; justify-content: space-between;">
        <Dropdown></Dropdown>
        <Dropdown></Dropdown>
    </div>
    <div>
        <Input full-width :placeholder="'Search..'"/>
        <Input full-width disabled :placeholder="'Search..'"/>

    </div>
    <Switch v-model="enabled"/>
    <Switch/>
    <div style="display: flex;">
        <Checkbox
            v-for="checkbox in checkboxes.checkbox" 
            :key="checkbox.name" 
            :name="checkbox.name" 
            @check="checkboxes.check"
        />
    </div>
    <Card :material="'qwartz'"/>
    <Card :material="'qwartz'" framed/>
    <Card/>
    <Card framed/>
    <Avatar :src="'http://i07.fotocdn.net/s124/e002875bda4ec088/gallery_xl/2825242466.jpg'"/>
    <Avatar :src="'https://v1.popcornnews.ru/k2/news/1200/upload/wcTTcx.jpg'"/>
    <Avatar :src="'https://i.pinimg.com/originals/75/0c/2b/750c2bf45eda818d53320b5607df7017.jpg'"/>
    <Avatar :src="'https://w.wallhaven.cc/full/95/wallhaven-95vk3w.png'"/>
</template>

<script setup lang="ts">

import { ref } from 'vue';

import { useCheckboxStore } from '../model/checkboxStore';
import { useCounterStore } from '../model/counterStore';

import { Button, Tag, Dropdown, Input, Switch, Checkbox, Card, Avatar } from '@/shared/ui';

const counter = useCounterStore();
const checkboxes = useCheckboxStore();

const enabled = ref(false);

</script>

<style>
@import './HomePage';
</style>../model/exampleStore