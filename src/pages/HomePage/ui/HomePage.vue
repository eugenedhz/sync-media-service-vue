<template>
    {{ counter.doubleCount }}
    <button @click="counter.increment()">inc</button>
</template>

<script setup lang="ts">
import { useCounterStore } from '../model/counterStore';

const counter = useCounterStore();

</script>

<style>
@import './HomePage';
</style>../model/exampleStore