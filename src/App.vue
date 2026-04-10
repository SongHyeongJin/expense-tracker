<script setup></script>

<template>
  <nav>
    <RouterView to="/transactions">거래 내역</RouterView>
    <RouterView to="/transactions/new">거래 등록</RouterView>
    <RouterView to="/summary">통계</RouterView>
  </nav>
  <router-view />
</template>
