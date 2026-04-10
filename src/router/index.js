import { createRouter, createWebHistory } from 'vue-router';
import TransactionFormPage from '@/pages/TransactionFormPage.vue';
import TransactionsPage from '@/pages/TransactionsPage.vue';
import SummaryPage from '@/pages/SummaryPage.vue';
import HomePage from '@/pages/HomePage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsPage,
    },
    {
      path: '/summary',
      name: 'summary',
      component: SummaryPage,
    },
    {
      path: '/transactions/new',
      name: 'transaction-new',
      component: TransactionFormPage,
    },
    {
      path: '/transactions/:id/edit',
      name: 'transaction-edit',
      component: TransactionFormPage,
    },
  ],
});

export default router;
