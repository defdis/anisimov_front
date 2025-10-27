import {useRouter} from 'vue-router'
import { useAuthStore } from '../stores/userStore.js'
import { useLocalStorage } from '@vueuse/core'

export function authGuard(to, from, next) {
	const auth = useAuthStore()
	if (to.meta.requiresAuth) {
		if (auth.isAuthenticated) {
			next()
		} else {
			auth.checkAuth().then(isAuthenticated => {
				if (isAuthenticated) {
					next()
				} else {
					next({name: 'admin_auth', query: {redirect: to.fullPath}})
				}
			})
		}
	} else {
		next()
	}
}
