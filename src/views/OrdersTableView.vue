<template>
    <div class="card p-4 mt-2">
        <h2 class="mb-4 black-text">Список всех заказов</h2>
        <div v-if="isLoading" class="text-center">
            <ProgressSpinner/>
            <p>Загрузка заказов...</p>
        </div>

        <Message v-else-if="error" severity="error">
            {{ error }}
        </Message>

        <DataTable
                v-else
                :value="orders"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                v-model:expandedRows="expandedRows"
                dataKey="id"
        >
            <Column headerStyle="width: 3rem">
                <template #body="slotProps">
                    <div style="cursor: pointer;">
                        <span @click="$router.push({name: 'order_id', params: {id: slotProps.data.id}})" class="pi pi-eye"></span>
                    </div>
                </template>
            </Column>
            <Column expander style="width: 3rem"/>
            <Column field="id" header="ID заказа" :sortable="true"/>
            <Column field="client.name" header="Клиент" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.client ? slotProps.data.client.name : 'Не указан' }}
                </template>
            </Column>
            <Column field="client.phone" header="Телефон">
                <template #body="slotProps">
                    {{ slotProps.data.client ? slotProps.data.client.phone : '-' }}
                </template>
            </Column>
            <Column header="Сумма заказа">
                <template #body="slotProps">
                    {{ formatOrderTotal(slotProps.data.furniture) }}
                </template>
            </Column>
            <Column field="created_at" header="Дата создания" :sortable="true">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Мебель в заказе №{{ slotProps.data.id }}</h5>
                    <DataTable :value="slotProps.data.furniture" responsiveLayout="scroll">
                        <Column field="title" header="Наименование"/>
                        <Column field="article" header="Артикул"/>
                        <Column field="quantity" header="Кол-во"/>
                        <Column header="Цена за шт.">
                            <template #body="furnitureProps">
                                {{ formatPrice(furnitureProps.data.price) }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script>
import OrderDetailComponent from '@/components/OrderDetailComponent.vue'
import { useAuthStore } from "@/stores/userStore"
import { useAllOrdersStore } from "@/stores/allOrdersStore"
import host from "../../host.js";

export default {
    name: 'OrdersTableView',
    components: {
        OrderDetailComponent
    },
    data() {
        return {
            ordersStore: useAllOrdersStore(),
            auth: useAuthStore(),
            orders: [],
            isLoading: true,
            error: null,
            expandedRows: [],
            selectedOrder: {},
        };
    },
    methods: {
        viewOrder(order) {

        },
        async fetchOrders() {
            this.isLoading = true;
            this.error = null;

            if (!this.auth.token) {
                this.error = 'Ошибка: вы не авторизованы для просмотра заказов.';
                this.isLoading = false;
                return;
            }

            try {
                const response = await fetch(host + '/api/v1/order/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.auth.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
                }

                this.orders = await response.json();
                this.ordersStore.orders = this.orders
            } catch (e) {
                console.error('Не удалось загрузить заказы:', e);
                this.error = 'Не удалось загрузить список заказов. Пожалуйста, попробуйте позже.';
            } finally {
                this.isLoading = false;
            }
        },
        formatPrice(price) {
            const number = parseFloat(price);
            return isNaN(number) ? '0 ₽' : number.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
        },
        formatOrderTotal(furniture) {
            if (!Array.isArray(furniture)) return this.formatPrice(0);
            const total = furniture.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            return this.formatPrice(total);
        },
        formatDate(dateString) {
            if (!dateString) return 'Неизвестно';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    mounted() {
        this.fetchOrders();
    },
};
</script>

<style scoped>
.card {
    color: #1f1f1f;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
