<template>
    <div class="flex align-content-start justify-content-left w-100 p-2">
        <FurnitureCardListComponent :products="furniture"></FurnitureCardListComponent>
    </div>
</template>

<script>
import host from "../../host.js"
import FurnitureCardListComponent from "@/components/FurnitureCardListComponent.vue"
import { useAuthStore } from "@/stores/userStore"
import { useScreenStore } from "@/stores/screenStore"
export default {
    name: "FurnitureView",
    components: {
        FurnitureCardListComponent,
    },
    created() {
        if (!this.auth.isAuthenticated) {
            this.$router.push({name: 'auth'})
        }
        this.$nextTick(() => {
            this.getFurniture()
        })
    },
    data() {
        return {
            furniture: [],
            auth: useAuthStore(),
            screen: useScreenStore(),
        }
    },
    methods: {
        async getFurniture() {
            let response = await fetch(host + '/api/v1/furniture/', {
                method: 'GET',
                mode: 'cors', // явно указываем режим CORS
                credentials: 'same-origin', // или 'include' если нужны куки
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.token,
                }
            })
            if (response.ok) {
                this.furniture = await response.json()
            } else if (response.status === 401) {
                this.$router.push({name: 'auth'})
            }
        },
    },
}
</script>

<style scoped>

</style>