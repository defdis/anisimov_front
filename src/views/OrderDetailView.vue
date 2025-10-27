<template>
    <div class="order-component">
        <Toast/>
        <OrderDetailComponent :order="order"></OrderDetailComponent>
    </div>
</template>

<script>
import OrderDetailComponent from "@/components/OrderDetailComponent.vue"
import { useAllOrdersStore } from "@/stores/allOrdersStore"
import host from "../../host.js";
import { useAuthStore } from "@/stores/userStore.js";

export default {
    name: 'OrderDetailView',
    components: {
        OrderDetailComponent,
    },

    computed: {
        order() {
            if (!Boolean(this.allOrders.orders.length)) {
                this.fetchOrder().then(() => {})
            }
            return this.allOrders.orders.find(order => {
                if (parseInt(order.id) === parseInt(this.$route.params.id)) {
                    return order
                }
            }) || {}
        }
    },
    data() {
        return {
            allOrders: useAllOrdersStore(),
            auth: useAuthStore(),
        }
    },
    methods: {
        async fetchOrder() {
            this.isLoading = true;
            this.error = null;

            if (!this.auth.token) {
                this.error = 'Ошибка: вы не авторизованы для просмотра заказов.';
                this.isLoading = false;
                return;
            }

            try {
                const response = await fetch( `${host}/api/v1/order/${this.$route.params.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.auth.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
                }
                let order = await response.json()
                this.allOrders.orders.push(order)
            } catch (e) {
                console.error('Не удалось загрузить заказы:', e);
                this.error = 'Не удалось загрузить список заказов. Пожалуйста, попробуйте позже.';
            } finally {
                this.isLoading = false;
            }
        },
    },
    watch: {
    }
}
</script>

<style scoped>
:deep(.p-datatable-tbody td) {
    text-align: center;
}
.order-component {
    max-width: 98%;
    margin: 0 auto;
}
</style>
