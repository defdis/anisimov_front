<template>
    <div class="flex flex-wrap gap-3 w-100">
        <div class=""
             style="width: 280px;"
             v-for="item in products"
             :key="item.key"
        >
            <Card>
                <template #header>
                    <Image image-class="item-card-image"
                        v-if="item.images && item.images.length"
                        :src="host + item.images[0].image"
                        alt="Фото"
                        preview
                        style="width: 100%; height: 200px; object-fit: cover;"
                    />
                </template>
                <template #title>
                    {{ item.title }}
                </template>
                <template #subtitle>
                    {{ item.label }}
                </template>
                <template #content>
                    <p>
                        {{ item.description }}
                    </p>
                    <p>
                        {{ item.material.title }}
                    </p>
<!--                    <p>{{ item.description }}</p>-->
<!--                    <ul>-->
<!--                        <li v-for="part in item.parts" :key="part.type">-->
<!--                            {{ part.type }} — {{ part.width }}×{{ part.length }} {{ part.material.title }}-->
<!--                        </li>-->
<!--                    </ul>-->
                </template>
                <template #footer>
                    <Button label="Подробнее" @click="$router.push({name: 'furniture_detail', params: {id: item.id}})" icon="pi pi-search"/>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import host from "../../host.js"

export default {
    props: {
        products: {
            type: Array,
            required: true,
        }
    },
    name: 'FurnitureCardListComponent',
    components: {

    },
    data() {
        return {
            host: host,
            // Пример инициализации products из вашего JSON (распакуем вложенность)
            // products: []
        }
    }
}
</script>

<style scoped>
.p-card {
    margin-bottom: 2rem;
}
::v-deep(.item-card-image) {
    width: 100% !important;
    height: auto !important;
    object-fit: cover !important;
}
</style>
