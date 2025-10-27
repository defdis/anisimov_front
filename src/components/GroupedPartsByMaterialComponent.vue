<template>
    <div class="parts-section">
        <div v-for="(partsGroup, materialArticle) in groupedPartsByMaterial()"
             :key="materialArticle" class="mb-6">
            <h3>
                Материал: {{ partsGroup[0].material.title }} (
                Артикул:
                <Tag :value="materialArticle" severity="info"/>
                )
                Размер листа: {{ partsGroup[0].material.width }}×{{ partsGroup[0].material.length }} мм
            </h3>
            <DataTable
                    :value="partsGroup"
                    class="p-datatable"
                    :rows="10"
                    responsiveLayout="scroll"
            >
                <Column field="type" header="Тип детали" :sortable="true" class="text-left">
                    <template #body="slotProps">
                        <span class="font-medium">{{ slotProps.data.type }}</span>
                    </template>
                </Column>
                <Column field="length" header="Длина (мм)" :sortable="true"/>
                <Column field="width" header="Ширина (мм)" :sortable="true"/>
                <Column header="Поворот" v-if="edit_mod">
                    <template #body="slotProps">
                        <Button
                                icon="pi pi-sync"
                                class="p-button-text"
                                @click="toggleRotation(slotProps.data)"
                        />
                    </template>
                </Column>
                <Column field="total_quantity" header="Общее количество" :sortable="true">
                    <template #body="slotProps">
                        {{ slotProps.data?.total_quantity || slotProps.data?.quantity }}
                    </template>
                </Column>

            </DataTable>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        parts: {
            type: Array,
            required: true
        },
        itemId: {
            type: Number,
            required: true,
        },
        edit_mod: {
            type: Boolean,
            default() {
                return false
            },
        }
    },
    methods: {
        groupedPartsByMaterial() {
            const groups = {}
            if (!this.parts) {
                return groups
            }
            this.parts.forEach((part) => {
                const article = part.material?.article || 'unknown'
                if (!groups[article]) {
                    groups[article] = []
                }
                groups[article].push(part)
            })
            return groups
        },
        toggleRotation(item) {
            // Вместо изменения store, генерируем событие
            this.$emit('rotate-part', {
                itemId: this.itemId,
                part: item,
                materialName: item.material.title,
            });
        },
        // Аналогично для редактирования
        // onPartEdit(event) {
        //     this.$emit('edit-part', {
        //         itemId: this.itemId,
        //         editEvent: event
        //     });
        // }
    }
}
</script>

<style scoped>

</style>