<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <nav class="top-nav">
    <RouterLink to="/">홈</RouterLink>
    <RouterLink to="/transactions">거래 내역</RouterLink>
    <RouterLink to="/transactions/new">거래 등록</RouterLink>
    <RouterLink to="/summary">통계</RouterLink>
    <RouterLink to="/budget">예산</RouterLink>
  </nav>
  <RouterView />
</template>
