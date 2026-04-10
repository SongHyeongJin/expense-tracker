<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const navItems = [
  { label: '홈', to: '/summary' },
  { label: '거래내역', to: '/transactions' },
  { label: '거래', to: '/transactions/new' },
];

const isActive = computed(() => (target) => {
  if (target === '/transactions') {
    return (
      route.path.startsWith('/transactions') && !route.path.endsWith('/new')
    );
  }

  if (target === '/transactions/new') {
    return route.path === '/transactions/new';
  }

  return route.path === target;
});
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">₩</div>
        <strong>가계부</strong>
      </div>

      <nav class="topnav" aria-label="주요 메뉴">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="shell-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #111827;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f7c948;
  color: #111827;
  font-size: 1.4rem;
  font-weight: 900;
}

.topnav {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 12px 16px;
  border-radius: 14px;
  color: #374151;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
}

.nav-link.active {
  background: #111827;
  color: #ffffff;
}

.shell-main {
  padding: 0 0 48px;
}

@media (max-width: 900px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topnav {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .topbar {
    padding: 18px 16px;
  }

  .brand {
    font-size: 1.6rem;
  }

  .nav-link {
    padding: 10px 14px;
    font-size: 0.95rem;
  }
}
</style>
