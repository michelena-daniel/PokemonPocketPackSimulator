import { createRouter, createWebHistory } from 'vue-router'
import BoosterPackSelectionView from '../views/BoosterPackSelectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BoosterPackSelectionView',
      component: BoosterPackSelectionView,
    },
  ],
})

export default router
