<template>
    <div>
        <div class="w-100">
            <div class="mb-2" v-if="packedSheets.length > 0">
                необходимо листов: {{ packedSheets.length }}шт.<br>
            </div>
        </div>
        <div class="grid formgrid mb-4 align-items-end">
            <div class="field col-12 md:col-2">
                <label class="font-semibold block mb-2">Толщина лезвия</label>
                <Dropdown
                        v-model="bladeThickness"
                        :options="bladeThicknessOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                />
            </div>
        </div>

        <div v-if="packedSheets.length > 0" class="drow_box">
            <div
                    v-for="(sheet, i) in packedSheets"
                    :key="`${sheet.materialName}-${i}`"
                    class="mb-6"
            >
                <p>Материал:  {{ sheet.materialName }} ({{ packedSheetsQuantity(sheet.materialName) }}шт.)</p>
                <p>Лист №{{ i + 1 }} ({{ sheet.width }} x {{ sheet.length }})</p>
                <svg
                        :width="sheet.width"
                        :height="sheet.length"
                        :viewBox="`0 0 ${sheet.width} ${sheet.length}`"
                        style="width: 100%; height: auto; background: #e4e4e4"
                >
                    <g v-for="part in sheet.parts" :key="part.key || part.id">
                        <rect
                                :x="part.x"
                                :y="part.y"
                                :width="part.width"
                                :height="part.length"
                                fill="lightcoral"
                                stroke="darkred"
                                stroke-width="1"
                        />
                        <text
                                :x="part.x + part.width / 2"
                                :y="part.y + part.length / 2"
                                fill="darkred"
                                font-weight="bold"
                                alignment-baseline="middle"
                                text-anchor="middle"
                        >
                            {{ part.type }} {{ part.width }}x{{ part.length }}
                        </text>
                    </g>
                </svg>

            </div>
        </div>
        <div v-else>
            <p>Нет деталей для отображения.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DrawingComponent',
    props: {
        parts: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            bladeThicknessOptions: [
                {label: '3 мм', value: 3},
                {label: '4 мм', value: 4},
                {label: '5 мм', value: 5},
            ],
            bladeThickness: 3,
            rotationFlags: [],
            localParts: [],
        }
    },
    computed: {
        quantityField() {
            // Выбор поля для количества, если есть quantity или count
            return this.localParts.some(p => p.quantity !== undefined) ? 'quantity' : 'count'
        },
        packedSheets() {
            if (!this.localParts.length) return []

            const materialGroups = {}

            this.localParts.forEach((part, idx) => {
                const qty = part.total_quantity || part.quantity || 1
                const materialName = (part.material && part.material.title) || part.material || 'unknown'

                if (!materialGroups[materialName]) {
                    let matWidth = 2000,
                            matLength = 1000
                    if (part.material && part.material.width && part.material.length) {
                        matWidth = part.material.width
                        matLength = part.material.length
                    }
                    materialGroups[materialName] = {
                        width: matWidth,
                        length: matLength,
                        parts: [],
                    }
                }

                for (let i = 0; i < qty; i++) {
                    materialGroups[materialName].parts.push({
                        ...part,
                        width: part.width,
                        length: part.length,
                        quantity: 1,
                        key: `${idx}-${i}`,
                        rotatable: true,
                    })
                }
            })

            const sheets = []

            Object.entries(materialGroups).forEach(([materialName, group]) => {
                const {width: sheetWidth, length: sheetLength} = group

                const findNode = (root, w, h) => {
                    if (root.used) {
                        return findNode(root.right, w, h) || findNode(root.down, w, h)
                    } else if (w <= root.width && h <= root.length) {
                        return root
                    } else {
                        return null
                    }
                }

                const splitNode = (node, w, h) => {
                    node.used = true
                    node.down = {
                        x: node.x,
                        y: node.y + h + this.bladeThickness,
                        width: node.width,
                        length: node.length - h - this.bladeThickness,
                        used: false,
                    }
                    node.right = {
                        x: node.x + w + this.bladeThickness,
                        y: node.y,
                        width: node.width - w - this.bladeThickness,
                        length: h,
                        used: false,
                    }
                    return node
                }

                let remainingParts = group.parts.slice().sort((a, b) => (b.width * b.length) - (a.width * a.length))

                let currentSheet = {
                    materialName: materialName,
                    width: sheetWidth,
                    length: sheetLength,
                    root: {
                        x: 0,
                        y: 0,
                        width: sheetWidth,
                        length: sheetLength,
                        used: false,
                        down: null,
                        right: null,
                    },
                    parts: [],
                }

                let maxIterations = 1000
                while (remainingParts.length > 0 && maxIterations > 0) {
                    maxIterations--
                    let node
                    let sheetParts = []
                    let placedAnyPart = false

                    for (let i = 0; i < remainingParts.length; i++) {
                        let part = remainingParts[i]
                        let placed = false

                        const w = part.width
                        const h = part.length
                        node = findNode(currentSheet.root, w, h)
                        if (node) {
                            const split = splitNode(node, w, h)
                            sheetParts.push({...part, x: split.x, y: split.y, width: w, length: h})
                            remainingParts.splice(i, 1)
                            i--
                            placed = true
                            placedAnyPart = true
                        }

                        if (!placed) continue
                    }

                    if (!placedAnyPart) {
                        console.warn('Невозможно разместить оставшиеся детали на листе:', remainingParts)
                        break
                    }

                    currentSheet.parts = sheetParts
                    sheets.push(currentSheet)

                    if (remainingParts.length > 0) {
                        currentSheet = {
                            materialName: materialName,
                            width: sheetWidth,
                            length: sheetLength,
                            root: {
                                x: 0,
                                y: 0,
                                width: sheetWidth,
                                length: sheetLength,
                                used: false,
                                down: null,
                                right: null,
                            },
                            parts: [],
                        }
                    }
                }

                if (maxIterations === 0) {
                    console.error('Превышено максимальное число итераций при раскрое')
                }
            })

            return sheets
        }
    },

    methods: {
        packedSheetsQuantity(materialName) {
            console.info(materialName)
            return this.packedSheets.filter(sheet => sheet.materialName === materialName).length
        },
        toggleRotation(idx) {
            this.rotationFlags.splice(idx, 1, !this.rotationFlags[idx])
            const part = this.localParts[idx]
            if (part) {
                const temp = part.width
                part.width = part.length
                part.length = temp
            }
        }
    },
    watch: {
        parts: {
            handler(newParts) {
                this.localParts = newParts ? newParts.map(p => ({...p})) : []
                this.rotationFlags = this.localParts.map(() => false)
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style scoped>
.drow_box {
    max-width: 900px;
    margin: 0 auto;
}
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid #999;
    padding: 0.4rem 0.6rem;
}
</style>
