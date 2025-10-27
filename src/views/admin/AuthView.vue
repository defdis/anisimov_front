<template>
	<div class="auth_view_container">
		<div class="auth_view_form">
			<InputText class="w-100"  type="email" name="email" placeholder="email" v-model="user.email"/>
			<InputText class="w-100" type="password"
				   name="password"
				   placeholder="password"
				   v-model="user.password"
				   @keyup.enter="handleEnter"
			/>
			<Button class="default_btn black_btn w-100" :class="{error: error}" @click="login">ok</Button>
		</div>
	</div>
</template>

<script>
import host from "../../../host"
import { useAuthStore } from "@/stores/userStore.js"

export default {
	name: "AuthView",
    components: {

    },
	mounted() {
		if (this.token) {
			this.$router.push({ name: "main" })
		}
	},
	computed: {

	},
	data() {
		return {
			auth: useAuthStore(),
			user: {
				email: "",
				password: "",
			},
			error: false,
		}
	},

	methods: {
		login() {
			this.auth.login(this.user.email, this.user.password).then((result) => {
                console.log('result', result)
				console.log('token', this.auth.token)
				console.log('isAuthenticated', this.auth.isAuthenticated)
				if (this.auth.isAuthenticated) {
					this.$router.push({name: "main"})
				} else {
					this.error = true
					setTimeout(() => {
						this.error = false
					}, 500)
				}
			})
		},
		handleEnter() {
			this.login()
		},
	},
	watch: {
	}
}
</script>

<style scoped>

.auth_view_container {
	display: flex;
	position: relative;
    width: 100vw;
    height: 80vh;
	justify-content: center;
}
.auth_view_form {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
}
.auth_view_form  input {
	padding: 0.2em 0.5em;
	margin-bottom: 0.5em;
	width: 100%;
}
.error,
.error:hover {
	border-color: #F64655 !important;
	background-color: #F64655 !important;
	color: white !important;
}

</style>