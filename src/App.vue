<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav class="top-nav">
    <RouterLink to="/">홈</RouterLink>
    <RouterLink to="/transactions">거래 내역</RouterLink>
    <RouterLink to="/transactions/new">거래 등록</RouterLink>
    <RouterLink to="/summary">통계</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px 24px;
}
</style>
