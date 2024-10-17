<template>
  <div
      class="panelTitle-container"
      :class="{ warningType: type === 'warning' }"
  >
    <div class="panelTitle">
      <svg
          aria-hidden="true">
        <use :href="JTSVG" />
      </svg>
      <span class="title gradient-text"><slot></slot></span>
    </div>
    <img :src="Light1IMG"  alt=""/>
  </div>
</template>

<script setup lang="ts">
import Light1IMG from '@/assets/images/light1.png';
import SvgIcon from "@/components/Head/SvgIcon.vue";
import JTSVG from '@/assets/images/jt.svg';
import {ref} from "vue";

const type = ref('');
</script>

<style scoped>

</style>
