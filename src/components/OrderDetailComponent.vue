<template>
    <div class="order-component">
        <Toast/>

        <h1 class="mb-4">Заказ № {{order.id}}</h1>
        <div v-if="order.furniture && order.furniture.length" class="w-100">
            <div v-if="order.client && Object.keys(order.client).length > 0" class="w-100 flex flex-row-wrap justify-content-between user_form mb-3">
                <FloatLabel variant="on" class="mr-2">
                    <InputText id="username" v-model="order.client.name" ></InputText>
                    <label for="username">Ф.И.О</label>
                </FloatLabel>
                <FloatLabel variant="on" class="mr-2">
                    <InputText id="email" v-model="order.client.email" ></InputText>
                    <label for="email">email</label>
                </FloatLabel>
                <FloatLabel variant="on" class="mr-2">
                    <InputMask id="phone" name="phone"
                           mask="+7 (999) 999-99-99"
                           class=""
                           v-model="order.client.phone"
                           :class="{'invalid': order.client.phone && !order.client.phone }"
                           autocomplete="off"
                    />
                    <label for="phone">телефон</label>
                </FloatLabel>
                <FloatLabel variant="on" class="">
                    <InputText id="city" v-model="order.client.address" ></InputText>
                    <label for="city">aдрес</label>
                </FloatLabel>
            </div>

<!--                    v-model:selection="selectedItem"-->
            <DataTable
                    :value="order.furniture"
                    v-model:expandedRows="expandedRows"
                    responsiveLayout="scroll"
                    dataKey="id"
                    selectionMode="single"
            >
                <Column expander style="width: 3rem"/>
                <Column header="">
                    <template #body="slotProps">
<!--                        {{slotProps.data.images.length}}-->
                        <img v-if="slotProps.data.images && slotProps.data.images.length" :src="$getImageUrl(slotProps.data.images[0].image)"
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
                                :edit_mod="false"
                        ></GroupedPartsByMaterialComponent>
                        <p v-if="!data.data.parts || data.data.parts.length === 0">
                            Нет деталей для отображения
                        </p>
                    </div>
                </template>
            </DataTable>

        </div>

        <div v-if="orderItemsParts.length">
            <h1 class="mt-3">Раскройка</h1>
            <DrawingComponent :key="orderItemsParts.length" :parts="orderItemsParts"></DrawingComponent>
        </div>

    </div>
</template>

<script>
import GroupedPartsByMaterialComponent from "@/components/GroupedPartsByMaterialComponent.vue"
import DrawingComponent from "@/components/DrawingComponent.vue"
import host from "../../host.js";

export default {
    props: {
        order: {
            type: Object,
            default() {return {
                client: {
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                },
            }}
        },
    },
    name: 'GetOrderView',
    created() {

    },
    components: {
        GroupedPartsByMaterialComponent,
        DrawingComponent,
    },
    data() {
        return {
            expandedRows: [],
            description: '',
        }
    },
    computed: {
        orderItemsParts() {
            let parts = []
            if (this.order.furniture && this.order.furniture.length) {
                this.order.furniture.forEach(item => {
                    item.parts.forEach(part => {
                        parts.push(part)
                    })
                })
            }
            return parts
        },
    },
    methods: {
        goToProducts() {
            this.$router.push({name: 'furniture'})
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
