<template>
    <div class="furniture-detail-container p-4">
        <!-- Хлебные крошки -->
        <div class="mb-4">
<!--            <Breadcrumb :home="home" :model="items" />-->
        </div>

        <div class="grid">
            <!-- Левая колонка - изображения -->
            <div class="col-12 md:col-6">
                <Card class="h-full">
                    <template #header>
                        <div class="image-container">
                            <img
                                :src="$getImageUrl(mainImage.image)"
                                :alt="furniture_item.title"
                                class="main-image w-full border-round"
                            />
                        </div>
                    </template>
                    <template #content>
                        <div v-if="furniture_item.images && furniture_item.images.length > 1" class="thumbnail-container flex gap-2 mt-3 flex-wrap">
                            <div
                                v-for="(img, index) in furniture_item.images"
                                :key="img.id"
                                class="thumbnail border-round cursor-pointer"
                                :class="{ 'thumbnail-active': currentImageIndex === index }"
                                @click="setCurrentImage(index)"
                            >
                                <img
                                    :src="$getImageUrl(img.image)"
                                    :alt="furniture_item.title"
                                    class="w-full border-round"
                                />
                            </div>

                        </div>
                        <!-- Размеры -->
                        <div class="sizes-section mb-5">
                            <h3 class="text-xl font-semibold mb-2">Размеры</h3>
                            <div class="grid">
                                <div class="col-8">
                                    <h2>глубина:</h2>
                                </div>
                                <div class="col-4">
                                    <h2>{{ furniture_item.depth }} мм.</h2>
                                </div>
                                <div class="col-8">
                                    <h2>ширина:</h2>
                                </div>
                                <div class="col-4">
                                    <h2>{{ furniture_item.width }} мм.</h2>
                                </div>
                                <div class="col-8">
                                    <h2>высота:</h2>
                                </div>
                                <div class="col-4">
                                    <h2>{{ furniture_item.height }} мм.</h2>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

            </div>

            <!-- Правая колонка - информация о товаре -->
            <div class="col-12 md:col-6">
                <Card class="h-full">
                    <template #header>
                        <div class="flex align-items-center justify-content-between">
                            <div>
                                <h1 class="text-3xl font-bold m-0">{{ furniture_item.title }}</h1>
                                <p class="text-color-secondary m-0 mt-2">{{ furniture_item.name }}</p>
                            </div>
                        </div>
                    </template>

                    <template #content>
                        <div class="product-info">
                            <!-- Цена -->
                            <div class="price-section mb-4">
                                <span class="text-4xl font-bold text-primary">
                                    {{ formatPrice(furniture_item.price) }}
                                </span>
                            </div>

                            <!-- Описание -->
                            <div class="description-section mb-5">
                                <h3 class="text-xl font-semibold mb-2">Описание</h3>
                                <p class="text-color-secondary line-height-3 m-0">
                                    {{ furniture_item.description || 'Описание отсутствует' }}
                                </p>
                            </div>


                            <!-- Основные характеристики -->
                            <div class="specs-section mb-5">
                                <h3 class="text-xl font-semibold mb-3">Основные характеристики</h3>
                                <div class="grid">
                                    <div class="col-6">
                                        <div class="spec-item p-2">
                                            <span class="font-semibold">Артикул:</span>
                                            <span class="ml-2">{{ furniture_item.key }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="spec-item p-2">
                                            <span class="font-semibold">Категория:</span>
                                            <span v-if="furniture_item.category" class="ml-2">{{ furniture_item.category.name }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="spec-item p-2">
                                            <span class="font-semibold">Количество деталей:</span>
                                            <span class="ml-2">{{ furniture_item.parts ? furniture_item.parts.length : 0 }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="spec-item p-2">
                                            <span class="font-semibold">ID:</span>
                                            <span class="ml-2">#{{ furniture_item.id }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #footer>

                        <!-- Управление заказом -->
                        <div class="flex gap-3 align-items-center mt-3">
                            <!-- Кнопка "Добавить" если нет в заказе -->
                            <Button
                                    v-if="!isInOrder"
                                    label="Добавить в заказ"
                                    icon="pi pi-shopping-cart"
                                    class="p-button-success"
                                    @click="addToOrder"
                            />

                            <!-- Управление количеством -->
                            <div v-else class="flex align-items-center gap-3">
                                <span class="text-sm">Количество:</span>
                                <InputNumber
                                        v-model="selectedQuantity"
                                        showButtons
                                        buttonLayout="horizontal"
                                        :min="0"
                                        :max="99"
                                        :step="1"
                                        inputClass="w-5rem text-center"
                                        @input="changeQuantity"
                                >
                                    <template #incrementbuttonicon>
                                        <span  class="pi pi-plus"/>
                                    </template>
                                    <template #decrementbuttonicon>
                                        <span class="pi pi-minus"/>
                                    </template>
                                </InputNumber>
                                <Button
                                        label="В заказе"
                                        icon="pi pi-check"
                                        class="p-button-secondary"
                                        disabled
                                />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>


        </div>

        <!-- Детализация -->
        <div class="mt-4">
            <h2 class="text-center font-bold mb-4">Детализация</h2>
            <Card>
                <template #content>
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Детали комплектации</Tab>
                            <Tab value="1">Информация о материалах</Tab>
                            <Tab value="2">Расчет материалов</Tab>
                            <Tab value="3">Раскройка</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <div v-if="furniture_item.parts && furniture_item.parts.length > 0">
                                    <GroupedPartsByMaterialComponent
                                            :key="furniture_item.id"
                                            :parts="furniture_item.parts"
                                            :item-id="furniture_item.id"
                                    ></GroupedPartsByMaterialComponent>
                                </div>
                            </TabPanel>
                            <TabPanel value="1">
                                <div class="materials-section">
                                    <h4 class="font-bold mb-4">Используемые материалы</h4>
                                    <div class="grid">
                                        <div
                                            v-for="(material, index) in uniqueMaterials"
                                            :key="index"
                                            class="col-12 md:col-6 lg:col-4"
                                        >
                                            <Card class="h-full">
                                                <template #content>
                                                    <div class="material-card">
                                                        <div class="flex align-items-center justify-content-between mb-3">
                                                            <h5 class="font-bold m-0">{{ material.title }}</h5>
                                                            <Tag :value="material.article" severity="success" />
                                                        </div>
                                                        <div class="material-specs">
                                                            <div class="spec-item flex justify-content-between py-2 border-bottom-1 surface-border">
                                                                <span class="font-medium">Производитель:</span>
                                                                <span>{{ material.manufacture }}</span>
                                                            </div>
                                                            <div class="spec-item flex justify-content-between py-2 border-bottom-1 surface-border">
                                                                <span class="font-medium">Толщина:</span>
                                                                <span>{{ material.thickness }} мм</span>
                                                            </div>
                                                            <div class="spec-item flex justify-content-between py-2 border-bottom-1 surface-border">
                                                                <span class="font-medium">Размер листа:</span>
                                                                <span>{{ material.width }}×{{ material.length }} мм</span>
                                                            </div>
                                                            <div class="spec-item flex justify-content-between py-2">
                                                                <span class="font-medium">Количество деталей:</span>
                                                                <span>{{ material.usageCount }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <div class="material-calculation">
                                    <h4 class="font-bold mb-4">Расчет расхода материалов</h4>
                                    <DataTable
                                        :value="materialCalculation"
                                        class="p-datatable-sm"
                                        :rows="10"
                                        responsiveLayout="scroll"
                                    >
                                        <Column field="article" header="Артикул" :sortable="true">
                                            <template #body="slotProps">
                                                <span class="font-medium">{{ slotProps.data.article }}</span>
                                            </template>
                                        </Column>
                                        <Column field="title" header="Материал" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.title }}
                                            </template>
                                        </Column>
                                        <Column field="totalArea" header="Общая площадь (м²)" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.totalArea.toFixed(3) }}
                                            </template>
                                        </Column>
                                        <Column field="sheetArea" header="Площадь листа (м²)" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.sheetArea.toFixed(3) }}
                                            </template>
                                        </Column>
                                        <Column field="requiredSheets" header="Необходимо листов" :sortable="true">
                                            <template #body="slotProps">
                                                <span class="font-bold text-primary">{{ slotProps.data.requiredSheets.toFixed(0) }}</span>
                                            </template>
                                        </Column>
                                        <Column field="usageCount" header="Деталей" :sortable="true">
                                            <template #body="slotProps">
                                                <Tag :value="slotProps.data.usageCount"/>
                                            </template>
                                        </Column>
                                        <Column field="wastePercentage" header="Процент отхода" :sortable="true">
                                            <template #body="slotProps">
                                                <span :class="{
                                                    'text-green-500': slotProps.data.wastePercentage < 10,
                                                    'text-orange-500': slotProps.data.wastePercentage >= 10 && slotProps.data.wastePercentage < 20,
                                                    'text-red-500': slotProps.data.wastePercentage >= 20
                                                }">
                                                    {{ slotProps.data.wastePercentage.toFixed(1) }}%
                                                </span>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </TabPanel>

                            <TabPanel value="3">
                                <DrawingComponent v-if="furniture_item.parts && furniture_item.parts.length > 0" :parts="furniture_item.parts"></DrawingComponent>
<!--                                <DrawingComponent v-if="furniture_item.parts.length > 0" :parts="furniture_item.parts"></DrawingComponent>-->
<!--                                <div v-else>Детали отсутствуют</div>-->
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import host from "../../host.js"
import { useAuthStore } from "@/stores/userStore"
import { useOrderStore } from '@/stores/orderStore'
import { useScreenStore } from "@/stores/screenStore"
import placeholderImage from "@/assets/img/placeholder-image.png"
import DrawingComponent from "@/components/DrawingComponent.vue"
import GroupedPartsByMaterialComponent from "@/components/GroupedPartsByMaterialComponent.vue"


export default {
    name: "FurnitureDetailView",
    components: {
        DrawingComponent,
        GroupedPartsByMaterialComponent,
    },
    created() {
        if (!this.auth.isAuthenticated) {
            this.$router.push({name: 'auth'})
        }
        this.getFurnitureItem().then(() => {}).catch((error) => {})
    },
    data() {
        return {
            furniture_item: {},
            auth: useAuthStore(),
            screen: useScreenStore(),
            orderStore: useOrderStore(),
            selectedQuantity: 1,
            currentImageIndex: 0,

            home: {
                icon: 'pi pi-home',
                to: '/'
            },
            items: [
                { label: 'Каталог', to: '/catalog' },
                { label: 'Мебель', to: '/furniture' },
                { label: 'Детали' }
            ],
        }
    },
    computed: {
        isInOrder() {
            return !!this.orderStore.getItemByID(this.furniture_item.id)
        },
        mainImage() {
            if (this.furniture_item.images && this.furniture_item.images.length > 0) {
                return this.furniture_item.images[this.currentImageIndex]
            }
            return { image: placeholderImage }
        },
        uniqueMaterials() {
            if (!this.furniture_item.parts) return []

            const materialMap = new Map()
            this.furniture_item.parts.forEach(part => {
                const material = part.material
                const key = material.article
                if (materialMap.has(key)) {
                    const existing = materialMap.get(key)
                    existing.usageCount += part.quantity || 1
                } else {
                    materialMap.set(key, {
                        ...material,
                        usageCount: part.quantity || 1
                    })
                }
            })

            return Array.from(materialMap.values())
        },
        materialCalculation() {
            if (!this.furniture_item.parts) return []

            const calculationMap = new Map()

            this.furniture_item.parts.forEach(part => {
                const material = part.material
                const key = material.article
                const partArea = (part.width * part.length) / 1000000 // м²
                const qty = part.quantity || 1
                const totalPartArea = partArea * qty

                if (calculationMap.has(key)) {
                    const existing = calculationMap.get(key)
                    existing.totalArea += totalPartArea
                    existing.usageCount += qty
                } else {
                    const sheetArea = (material.width * material.length) / 1000000 // м²
                    calculationMap.set(key, {
                        article: material.article,
                        title: material.title,
                        totalArea: totalPartArea,
                        sheetArea: sheetArea,
                        usageCount: qty,
                        requiredSheets: 0,
                        wastePercentage: 0
                    })
                }
            })

            // Рассчитываем необходимое количество листов и процент отхода
            const calculations = Array.from(calculationMap.values())
            calculations.forEach(calc => {
                calc.requiredSheets = Math.ceil(calc.totalArea / calc.sheetArea)

                const totalSheetArea = calc.requiredSheets * calc.sheetArea

                calc.wastePercentage = totalSheetArea > 0
                    ? ((totalSheetArea - calc.totalArea) / totalSheetArea) * 100
                    : 0
            })

            return calculations
        },
    },
    methods: {
        addToOrder() {
            if (this.selectedQuantity === 0) {
                this.selectedQuantity = 1
            }
            const itemToAdd = {
                ...this.furniture_item,
                quantity: this.selectedQuantity,
            }
            this.orderStore.addItem(itemToAdd)
            this.$toast.add({
                severity: 'success',
                summary: 'Добавлено',
                detail: `${this.furniture_item.title} добавлен в заказ`,
                life: 3000,
            })
        },
        changeQuantity() {
            const item = this.orderStore.getItemByID(this.furniture_item.id)
            if (item) {
                item.parts.forEach(part => {
                    part.total_quantity = (item.quantity+1) * part.quantity
                })
                this.orderStore.updateQuantity(this.furniture_item.id, this.selectedQuantity)
            }
        },
        async getFurnitureItem() {
            let response = await fetch(`${host}/api/v1/furniture/${this.$route.params.id}/`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.token,
                }
            })
            if (response.ok) {
                this.furniture_item = await response.json()
                for (const idx in this.furniture_item.parts) {
                    this.furniture_item.parts[idx].total_quantity = this.furniture_item.parts[idx].quantity * this.selectedQuantity
                }

            } else if (response.status === 401) {
                this.$router.push({name: 'auth'})
            }
        },

        setCurrentImage(index) {
            this.currentImageIndex = index
        },
        formatPrice(price) {
            if (!price) return '0.00₽'
            return `${parseFloat(price).toFixed(2)}₽`
        },
    },
    watch: {
        selectedQuantity: {
            immediate: true,
            handler(newValue) {
                const item = this.orderStore.getItemByID(this.furniture_item.id)
                if (newValue < 1) {
                    this.orderStore.removeItem(item.id)
                }

            }
        },
    }
}
</script>

<style scoped>

.furniture-detail-container {
    max-width: 1400px;
    margin: 0 auto;
}

.image-container {
    position: relative;
    padding: 1rem;
    background: var(--surface-ground);
    border-radius: 12px;
}

.main-image {
    max-height: 500px;
    object-fit: contain;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.thumbnail:hover {
    border-color: var(--primary-color);
    transform: scale(1.05);
}

.thumbnail-active {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color);
}

.thumbnail img {
    height: 100%;
    object-fit: cover;
}

.spec-item {
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.spec-item:hover {
    background: var(--surface-hover);
}

.material-card {
    height: 100%;
}

.material-specs {
    font-size: 0.9rem;
}

.quantity-selector {
    text-align: center;
}
.quantity-selector-input {
    min-width: 40px;
}

:deep(.p-card) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--surface-border);
}

:deep(.p-tabpanels) {
    min-height: 700px;
}
:deep(.p-card-header) {
    padding: 1.5rem 1.5rem 0;
}

:deep(.p-card-content) {
    padding: 1.5rem;
}

:deep(.p-card-footer) {
    padding: 0 1.5rem 1.5rem;
}

@media (max-width: 768px) {
    .furniture-detail-container {
        padding: 1rem;
    }

    .thumbnail {
        width: 60px;
        height: 60px;
    }

    .flex-wrap {
        flex-wrap: wrap;
    }
}
</style>