<script lang="ts">
import { PropType } from 'vue';
import { Media } from '../../api/requests';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { __BASE_URL__ } from '@/shared/config/environment';
// import MediaDetailsCard from '../MediaDetailsCard/ui'
import 'swiper/css';

import { Checkbox } from '@/shared/ui'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
          url: __BASE_URL__
        }
    },
    setup() {
        return {
            modules: [Pagination, Scrollbar, A11y, Autoplay],
        };
    },
    props: {
        medias: Array as PropType<Media[]>
    }
};
</script>

<template>
  <div>
    <swiper 
      class="sliderWrapper"
      style="max-width: 1268px; width: 100%; border-radius: 15px;" 
      :modules="modules"
      :pagination="{ clickable: true }" 
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
    >
      <template v-for="media in medias" :key="media.id" :virtualIndex="media.id">
        <swiper-slide :height="'371px'">
          <div>
            <img :width="'100%'" style=" object-fit: cover;" :height="'371px'" :src="url + media.preview" />
          </div>
        </swiper-slide>
      </template>
    </swiper>
  </div>
</template>

<style scoped lang="css">
@import url('./MediaSwiper.css');
</style>