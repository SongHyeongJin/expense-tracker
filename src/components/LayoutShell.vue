<template>
  <div class="layout-shell bg-light min-vh-100 pb-5">
    <header class="p-3 bg-white shadow-sm mb-3">
      <h1 class="h5 mb-0 fw-bold text-center">나의 가계부</h1>
    </header>

    <main class="container">
      <slot></slot>
    </main>

    <nav
      class="fixed-bottom bg-white border-top d-flex justify-content-around py-2"
    >
      <div class="text-center small text-muted">
        <i class="bi bi-house-door"></i>
        <div>홈</div>
      </div>
      <div class="text-center small text-primary">
        <i class="bi bi-list-ul"></i>
        <div>내역</div>
      </div>
      <div class="text-center small text-muted">
        <i class="bi bi-plus-circle"></i>
        <div>추가</div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.layout-shell {
  max-width: 500px;
  margin: 0 auto;
} /* 모바일 퍼스트 레이아웃 */
nav i {
  font-size: 1.2rem;
}
</style>
