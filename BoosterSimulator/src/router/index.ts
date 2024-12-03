import { createRouter, createWebHistory } from 'vue-router'
import BoosterPackSelectionView from '../views/BoosterPackSelectionView.vue'
import CollectionView from '@/views/CollectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BoosterPackSelectionView',
      component: BoosterPackSelectionView,
    },
    {
      path: '/collection',
      name: 'CollectionView',
      component: CollectionView
    }
  ],
})

export default router
