import {defineStore} from 'pinia'
import VueCookies from 'vue-cookies'
import router from '../router/index.js'

import host from '../../host.js'
const $cookies = VueCookies
export const useAuthStore = defineStore('auth', {

	state: () => ({
		token: null,
		user: null
	}),
	actions: {
		async login(email, password) {
			try {
				// login API call

				const response = await fetch(host + '/api/v1/auth/login/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: email,
						password: password
					}),
					credentials: 'include',
				})
				if (response.ok) {
					const data = await response.json()
					console.log('login data', data)
					this.setToken(data.access)
					return true
				} else {
					console.log('Login failed:', response)
					return false
				}

				// Store token securely (e.g., in HttpOnly cookie)
				// document.cookie = data.token


			} catch (error) {
				alert('Login failed:', error)
				return false
			}
		},
		parseJwt() {
			try {
				// Split the token into its three parts
				const parts = this.getToken().split('.');

				if (parts.length !== 3) {
					throw new Error('Invalid token format');
				}
				const decodedPayload = JSON.parse(atob(parts[1]));

				return decodedPayload;
			} catch (error) {
				console.error('Error decoding JWT:', error);
				return null;
			}
		},
		logout() {
			this.token = null
			this.user = null
			// Clear token from cookies
			this.setToken('')
			// Redirect to login page
			router.push({name: 'login'})
		},
		setToken(token) {
			$cookies.set('accessToken', token, 24 * 60 * 1000)
			this.token = token
			if (token) {
				this.user = this.parseJwt()
			}
		},
		getToken() {
			let accessToken = $cookies.get('accessToken') || ''
			if (!this.token && accessToken) {
				this.token = accessToken
			}
			return this.token
		},
		async checkAuth() {
			try {
				// Check if token exists in cookies
				const token = this.getToken()
				if (!token) return false

				// Verify token with backend
				const response = await fetch('/api/v1/auth/check_auth/', {
					method: 'POST',
					body: JSON.stringify({
						token: this.getToken(),
					})
				})

				if (response.ok) {
					const data = await response.json()
					this.token = token
					return true
				} else {
					this.token = ''
					this.setToken('')
				}
			} catch (error) {
				console.error('Authentication check failed:', error)
			}
			return false
		}
	},
	getters: {
		// get_item_by_id: (state) => (id) => state.items.find(item => item.id === id) || null
		isAuthenticated: (state) => {
			return Boolean(state.getToken())
			// return Boolean(state.getToken()) && Boolean(state.checkAuth())
		},
	}
})