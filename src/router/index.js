import { createRouter, createWebHistory } from 'vue-router';
import TransactionFormPage from '@/pages/TransactionFormPage.vue';
import TransactionsPage from '../pages/TransactionsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/transactions',
      name: 'transaction-server',
      component: TransactionsPage,
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
