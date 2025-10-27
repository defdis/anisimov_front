<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Ваш заказ</h1>

        <div v-if="orderStore.itemCount > 0">
            <DataTable :value="orderStore.furniture_items" responsiveLayout="scroll">
                <Column field="title" header="Название"></Column>
                <Column header="Цена">
                    <template #body="slotProps">
                        <!-- Используем глобальный хелпер, как и в других частях проекта -->
                        {{ $toMoneyString(slotProps.data.price) }}
                    </template>
                </Column>
                <Column header="Количество">
                    <template #body="slotProps">
                        <InputNumber
                                :modelValue="slotProps.data.quantity"
                                @update:modelValue="orderStore.updateQuantity(slotProps.data.id, $event)"
                                showButtons
                                buttonLayout="horizontal"
                                :step="1"
                                :min="1"
                                class="w-8rem"
                        />
                    </template>
                </Column>
                <Column header="Сумма">
                    <template #body="slotProps">
                        {{ $toMoneyString(slotProps.data.price * slotProps.data.quantity) }}
                    </template>
                </Column>
                <Column>
                    <template #body="slotProps">
                        <Button
                                icon="pi pi-trash"
                                class="p-button-danger p-button-text"
                                @click="orderStore.removeItem(slotProps.data.id)"
                        />
                    </template>
                </Column>
            </DataTable>

            <div class="flex justify-content-end align-items-center mt-4 gap-3">
                <h2 class="text-xl font-semibold">Итого: {{ $toMoneyString(orderStore.totalPrice) }}</h2>
                <Button label="Очистить заказ" icon="pi pi-times" class="p-button-danger"
                        @click="orderStore.clearOrder()"/>
                <Button label="Оформить заказ" icon="pi pi-check"/>
            </div>

        </div>
        <div v-else>
            <p>Ваш заказ пуст.</p>
            <Button label="К выбору мебели" icon="pi pi-arrow-left" class="mt-3"
                    @click="$router.push({ name: 'furniture' })"/>
        </div>
    </div>
</template>

<script>
// Импортируем наше новое хранилище
import {useOrderStore} from '@/stores/orderStore';

export default {
    name: "HomeView",
    // Инициализируем хранилище в data(), как вы это делаете в других компонентах
    data() {
        return {
            orderStore: useOrderStore(),
        }
    },
    methods: {
    },
}
</script>

<style scoped>
/* Стили для InputNumber, чтобы кнопки были видны */
:deep(.p-inputnumber-button) {
    padding: 0.5rem;
}
</style>
