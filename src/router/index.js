import {createRouter, createWebHistory} from 'vue-router'
import { authGuard } from './guard'
import { useScreenStore } from '@/stores/screenStore'
import HomeView from '@/views/HomeView.vue'
import FurnitureView from '@/views/FurnitureView.vue'
import FurnitureDetailView from '@/views/FurnitureDetailView.vue'
import AuthView from '@/views/admin/AuthView.vue'
import GetOrderView from '@/views/GetOrderView.vue'
import OrdersTableView from '@/views/OrdersTableView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL || '/'),
	routes: [
		{
			path: '/',
			name: 'main',
			component: HomeView,
			meta: {
				title: 'Главная',
				// requiresAuth: true,
				// admin: true
			}
		},
		{
			path: '/furniture',
			name: 'furniture',
			component: FurnitureView,
			meta: {
				title: 'Мебель',
				// requiresAuth: true,
				// admin: true
			}
		},
		{
			path: '/furniture/:id',
			name: 'furniture_detail',
			component: FurnitureDetailView,
			meta: {
				title: 'Мебель',
				// requiresAuth: true,
				// admin: true
			}
		},
		{
			path: '/auth',
			name: 'auth',
			component: AuthView,
			meta: {
				title: 'авторизация',
			}
		},
		{
			path: '/order',
			name: 'order',
			component: GetOrderView,
			meta: {
				title: 'Мой заказ',
				// requiresAuth: true, // Защищаем страницу заказа
			}
		},
		{
			path: '/orders',
			name: 'orders',
			component: OrdersTableView,
			meta: {
				title: 'Все заказы',
				// requiresAuth: true, // Защищаем страницу заказа
			}
		},
		{
			path: '/orders/:id',
			name: 'order_id',
			component: OrderDetailView,
			meta: {
				title: 'Просмотр заказа',
				// requiresAuth: true, // Защищаем страницу заказа
			}
		},

	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
		  return savedPosition;
		} else {
		  return { top: 0 };
		}
	},
})





router.afterEach((to, from) => {

})

// router.beforeEach(authGuard)

export default router

