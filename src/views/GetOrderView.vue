<template>
    <div class="order-view">
        <Toast/>
        <h1 class="mb-4">Корзина заказа</h1>
        <div v-if="orderItems.length === 0">
            <p class="pb-5">Заказ пуст. Пожалуйста, добавьте товары.</p>
            <Button label="Перейти к товарам" icon="pi pi-arrow-right" @click="goToProducts"/>
        </div>
        <div v-else class="w-100">
            <div class="w-100 flex flex-row-wrap justify-content-between user_form mb-3">
                <FloatLabel variant="on" class="mr-2">
                    <InputText id="username" v-model="orderStore.client.name" ></InputText>
                    <label for="username">Ф.И.О</label>
                </FloatLabel>
                <FloatLabel variant="on" class="mr-2">
                    <InputText id="email" v-model="orderStore.client.email" ></InputText>
                    <label for="email">email</label>
                </FloatLabel>
                <FloatLabel variant="on" class="mr-2">
                    <InputMask id="phone" name="phone"
                           mask="+7 (999) 999-99-99"
                           class=""
                           v-model="orderStore.client.phone"
                           :class="{'invalid': orderStore.client.phone && !orderStore.client.phone }"
                           autocomplete="off"
                    />
                    <label for="phone">телефон</label>
                </FloatLabel>
                <FloatLabel variant="on" class="">
                    <InputText id="city" v-model="orderStore.client.address" ></InputText>
                    <label for="city">aдрес</label>
                </FloatLabel>
            </div>

<!--                    v-model:selection="selectedItem"-->
            <DataTable
                    :value="orderItems"
                    v-model:expandedRows="expandedRows"
                    responsiveLayout="scroll"
                    dataKey="id"
                    selectionMode="single"
            >
                <Column expander style="width: 3rem"/>
                <Column field="images" header="">
                    <template #body="slotProps">
                        <img v-if="slotProps.data.images.length" :src="$getImageUrl(slotProps.data.images[0].image)"
                             :alt="slotProps.data.title"
                             style="min-width: 50px; max-height: 50px; object-fit: contain;"
                             class="main-image w-full border-round"
                        />
                    </template>
                </Column>
                <Column field="title" header="Наименование" style="width: 20%"/>
                <Column field="width" header="длинна"/>
                <Column field="depth" header="глубина"/>
                <Column field="height" header="высота"/>
                <Column field="parts" header="Детали">
                    <template #body="slotProps">
                        {{slotProps.data.parts.length}}
                    </template>
                </Column>
                <Column header="Количество">
                    <template #body="slotProps">
                        <div class="flex align-items-center gap-2">
                            <Button
                                    icon="pi pi-minus"
                                    class="p-button-rounded p-button-text p-button-danger"
                                    @click="() => decreaseQuantity(slotProps.data)"
                                    :disabled="slotProps.data.quantity <= 1"
                            />
                            <span class="text-lg font-semibold">{{ slotProps.data.quantity }}</span>
                            <Button
                                    icon="pi pi-plus"
                                    class="p-button-rounded p-button-text p-button-success"
                                    @click="() => increaseQuantity(slotProps.data)"
                            />
                        </div>
                    </template>
                </Column>
                <Column field="price" header="Цена" :body="priceTemplate"/>
                <Column header="Итого">
                    <template #body="slotProps">
                        {{ this.$toMoneyString((slotProps.data.price || 0) * (slotProps.data.quantity || 1)) }}
                    </template>
                </Column>
                <Column header="Действия">
                    <template #body="slotProps">
                        <Button
                                icon="pi pi-trash"
                                class="p-button-danger"
                                @click="() => removeItem(slotProps.data.id)"
                                tooltip="Удалить"
                        />
                    </template>
                </Column>
                <template #expansion="data">
                    <div class="p-3">
                        <h4>Детали по материалам:</h4>
                        <GroupedPartsByMaterialComponent
                                :parts="data.data.parts"
                                :item-id="data.data.id"
                                :edit_mod="true"
                                @rotatePart="handleRotatePart"
                                @editPart="handleEditPart"
                        ></GroupedPartsByMaterialComponent>
                        <p v-if="!data.data.parts || data.data.parts.length === 0">
                            Нет деталей для отображения
                        </p>
                    </div>
                </template>
            </DataTable>

        </div>
        <div v-if="orderItems.length > 0" class="text-right text-xl font-semibold mt-4 mb-3">
            Общая сумма: {{ totalPriceFormatted }}
        </div>
        <Button v-if="orderItems.length > 0"
                label="Сохранить заказ"
                icon="pi pi-save"
                class="p-button-success"
                @click="checkout"
        />
        <div v-if="orderItemsParts.length">
            <h1 class="mt-3">Раскройка</h1>
            <DrawingComponent :key="orderItemsParts.length" :parts="orderItemsParts"></DrawingComponent>
        </div>

    </div>
</template>

<script>
import GroupedPartsByMaterialComponent from "@/components/GroupedPartsByMaterialComponent.vue"
import DrawingComponent from "@/components/DrawingComponent.vue"
import {useOrderStore} from '@/stores/orderStore'
import host from "../../host.js";

export default {
    name: 'GetOrderView',
    components: {
        GroupedPartsByMaterialComponent,
        DrawingComponent,
    },
    data() {
        return {
            orderStore: useOrderStore(),
            expandedRows: [],
            description: '',
        }
    },
    computed: {

        orderItems() {
            return this.orderStore.furniture_items
        },
        orderItemsParts() {
            let parts = []
            this.orderStore.furniture_items.forEach(item => {
                item.parts.forEach(part => {
                    parts.push(part)
                })
            })
            return parts
        },
        totalPriceFormatted() {
            return this.$toMoneyString(
                    this.orderStore.furniture_items.reduce(
                            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                            0
                    )
            )
        },
    },
    methods: {
        handleRotatePart(payload) {
            const orderItem = this.orderStore.getItemByID(payload.itemId)

            if (!orderItem || !Array.isArray(orderItem.parts)) return

            // Создаём копию массива всех деталей для реактивности
            const updatedParts = [...orderItem.parts]

            // Фильтруем детали по заданному материалу
            const partsByMaterial = updatedParts.filter(
                    part => (part.material?.title || 'Без материала') === payload.materialName
            )
            const rowIndex = partsByMaterial.findIndex(obj => obj.id === payload.part.id)
            if (rowIndex === -1) return
            const targetPart = partsByMaterial[rowIndex]
            if (!targetPart) return

            // Находим индекс targetPart в общем массиве updatedParts
            const targetIndex = updatedParts.findIndex(part => part === targetPart)
            if (targetIndex === -1) return

            // Создаем обновленную копию детали с перевернутыми размерами
            const rotatedPart = {
                ...targetPart,
                width: targetPart.length,
                length: targetPart.width,
            }
            // Заменяем старую деталь на новую в массиве
            updatedParts.splice(targetIndex, 1, rotatedPart)

            // Обновляем заказ с новым массивом деталей
            const updatedOrderItem = {...orderItem, parts: updatedParts}

            this.orderStore.furniture_items = this.orderStore.furniture_items.map(item =>
                item.id === payload.itemId ? updatedOrderItem : item
            )
            // this.selectedItem.parts = updatedOrderItem.parts
            orderItem.parts = updatedOrderItem.parts
        },
        handleEditPart(payload) {
            this.onPartEditComplete(payload.orderId, payload.editEvent);
        },
        increaseQuantity(item) {
            item.parts.forEach(part => {
                part.total_quantity = (item.quantity+1) * part.quantity
            })
            this.orderStore.updateQuantity(item.id, item.quantity + 1)
        },
        decreaseQuantity(item) {
            if (item.quantity > 1) {
                item.parts.forEach(part => {
                    part.total_quantity = (item.quantity-1) * part.quantity
                })
                this.orderStore.updateQuantity(item.id, item.quantity - 1)
            }
        },
        removeItem(id) {
            this.orderStore.removeItem(id)
        },
        goToProducts() {
            this.$router.push({name: 'furniture'})
        },
        checkout() {
            console.info('checkout')
            const submitOrder = {
                client: this.orderStore.client,
                furniture: this.orderStore.furniture_items,
                description: this.description
            }

            this.orderStore.submitOrder(submitOrder).then((result) => {
                console.info('result', result)
                if (result.success === true) {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Заказ оформлен',
                        detail: 'Спасибо за ваш заказ!',
                        life: 3000,
                    })
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Заказ не оформлен',
                        detail: result.error.detail,
                        life: 3000,
                    })
                }

            })
        },
        priceTemplate(item) {
            return this.$toMoneyString(item.price || 0)
        },
        onPartEditComplete(orderId, event) {
            const orderItem = this.orderStore.getItemByID(orderId)
            if (!orderItem || !orderItem.parts) return

            const parts = [...orderItem.parts]
            const part = {...parts[event.rowIndex]}
            if (!part) return

            const {field, newValue} = event
            if (newValue && newValue > 0) {
                part[field] = newValue
            }
            parts[event.rowIndex] = part

            const newOrderItem = {...orderItem, parts}
            this.orderStore.furniture_items = this.orderStore.furniture_items.map(item =>
                    item.id === orderId ? newOrderItem : item
            )
        },
    },
    watch: {
        selectedItem(newVal) {
            if (Boolean(newVal)) {
				this.expandedRows = {[newVal.id]: true}
			} else {
				this.expandedRows = null
			}
        },
    }
}
</script>

<style scoped>
:deep(.p-datatable-tbody td) {
    text-align: center;
}
.order-view {
    max-width: 98%;
    margin: 0 auto;
}
</style>
