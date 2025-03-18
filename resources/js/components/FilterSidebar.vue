<template>
    <aside class="filter-sidebar">
        <!-- Categories Section -->
        <div class="filter-section">
            <h3 class="filter-title">Categories</h3>
            <div class="filter-items">
                <div v-for="(section, key) in categories" :key="key" class="category-section">
                    <h4 class="section-title">{{ key }}</h4>
                    <div class="category-grid">
                        <span v-for="category in section" :key="category.category_id" class="filter-item">
                            <Checkbox 
                                :value="buildCategoryUrl(category)"
                                v-model="activeCategory"
                                @change="() => handleCategoryChange(category)"
                                :pt="{ root: { class: 'mr-2' } }"
                                size="small"
                                :inputId="`category-${category.category_id}`"
                            />
                            <label :for="`category-${category.category_id}`" class="filter-label text-sm">
                                {{ category.category_name }}
                            </label>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formats Section -->
        <div class="filter-section">
            <h3 class="filter-title">Format</h3>
            <div class="filter-items">
                <span v-for="format in formats" :key="format.value" class="filter-item">
                    <Checkbox :value="format.value" v-model="activeFormat"
                        @change="() => handleFormatChange(format.value)" :pt="{ root: { class: 'mr-2' } }" size="small"
                        :inputId="format.value" />
                    <label :for="format.value" class="filter-label"><img :src="format.icon" :alt="format.label"
                            class="format-icon" :class="{ 'selected': activeFormat.includes(format.value) }" /></label>
                </span>
            </div>
        </div>

        <!-- Colors Section -->
        <div class="filter-section">
            <h3 class="filter-title">Colors</h3>
            <div class="color-grid">
                <span v-for="color in colors" :key="color.value" class="color-swatch"
                    :class="{ 'selected': activeColor.includes(color.value) }" :style="{ backgroundColor: color.hex }"
                    @click="() => handleColorChange(color.value)" :title="color.label">
                </span>
            </div>
        </div>
        <div class="flex justify-center items-center mb-4">
                    <Button icon="pi pi-eraser" @click="clearFilters"
                        label="Clear Filters" severity="info"
                        size="medium" class="filter-button" variant="outlined" raised />
                </div>
    </aside>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import Checkbox from 'primevue/checkbox';

const props = defineProps({
    listId: String,
    activeFilters: {
        type: Array,
        default: () => []
    }
});

const categories = ref({});

const formats = [
    { label: 'Horizontal', value: 'horizontal', icon: '/images/formats/geometry-horizontal.png' },
    { label: 'Vertical', value: 'vertical', icon: '/images/formats/geometry-vertical.png' },
    { label: 'Square', value: 'square', icon: '/images/formats/geometry-square.png' },
    { label: 'Panorama', value: 'panorama', icon: '/images/formats/geometry-panoramic.png' }
];

const colors = [
    { label: 'Red', value: 'red', hex: '#FF0000' },
    { label: 'Orange', value: 'orange', hex: '#FFA500' },
    { label: 'Yellow', value: 'yellow', hex: '#FFFF00' },
    { label: 'Green', value: 'green', hex: '#008000' },
    { label: 'Turquoise', value: 'turquoise', hex: '#40E0D0' },
    { label: 'Blue', value: 'blue', hex: '#0000FF' },
    { label: 'Lilac', value: 'lilac', hex: '#C8A2C8' },
    { label: 'Pink', value: 'pink', hex: '#FFC0CB' },
    { label: 'High Key', value: 'highkey', hex: '#FFFFFF' },
    { label: 'Low Key', value: 'lowkey', hex: '#000000' }
];

const activeCategory = computed({
    get: () => {
        const category = props.activeFilters.find(f => f.startsWith('cat_'));
        return category ? [category] : [];
    },
    set: () => { } // Handled by change event
});

const activeFormat = computed({
    get: () => {
        const format = props.activeFilters.find(f => ['horizontal', 'vertical', 'square', 'panorama'].includes(f));
        return format ? [format] : [];
    },
    set: () => { } // Handled by change event
});

const activeColor = computed({
    get: () => {
        const color = props.activeFilters.find(f => colors.map(c => c.value).includes(f));
        return color ? [color] : [];
    },
    set: () => { } // Handled by change event
});

const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories');
        categories.value = response.data.items;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const isActiveCategory = (categoryId) => {
    return props.activeFilters.includes(`cat_${categoryId}`);
};

const isActiveFilter = (filterValue) => props.activeFilters.includes(filterValue);

const buildCategoryUrl = (category) => {
    const categorySlug = `cat_${category.category_name.toLowerCase().replace(/ /g, '-')}`;
    return categorySlug;
};

const buildFilterUrl = (type, value) => {
    const currentFilters = [...props.activeFilters];
    const filterIndex = currentFilters.indexOf(value);

    if (filterIndex === -1) {
        currentFilters.push(value);
    } else {
        currentFilters.splice(filterIndex, 1);
    }

    return currentFilters.length ? currentFilters.join('/') : '';
};

const getActiveCategory = () => {
    return props.activeFilters.find(f => f.startsWith('cat_')) || '';
};

const getActiveFormat = () => {
    return props.activeFilters.find(f => ['horizontal', 'vertical', 'square', 'panorama'].includes(f)) || '';
};


const getActiveColor = () => {
    return props.activeFilters.find(f => colors.map(c => c.value).includes(f)) || '';
};

const updateUrl = (filters) => {
    const cleanFilters = filters.filter(f => f).join('/');
    router.visit(`/collection/${props.listId}//${cleanFilters}`);
};

const clearFilters = () => {
    router.visit(`/collection/${props.listId}`);
};

const handleCategoryChange = (category) => {
    const categorySlug = buildCategoryUrl(category);
    const otherFilters = props.activeFilters.filter(f => !f.startsWith('cat_'));

    if (getActiveCategory() === categorySlug) {
        updateUrl(otherFilters);
    } else {
        updateUrl([categorySlug, ...otherFilters]);
    }
};

const handleFormatChange = (format) => {
    const otherFilters = props.activeFilters.filter(f => !formats.map(f => f.value).includes(f));

    if (getActiveFormat() === format) {
        updateUrl(otherFilters);
    } else {
        updateUrl([format, ...otherFilters]);
    }
};

const handleColorChange = (color) => {
    const otherFilters = props.activeFilters.filter(f => !colors.map(c => c.value).includes(f));

    if (getActiveColor() === color) {
        updateUrl(otherFilters);
    } else {
        updateUrl([color, ...otherFilters]);
    }
};

onMounted(fetchCategories);
</script>

<style scoped>
.filter-sidebar {
    width: 380px;
    padding: 20px;
    background: white;
    border-right: 1px solid #eee;
    height: 100vh;
    overflow-y: auto;
}

.filter-section {
    margin-bottom: 30px;
}

.filter-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

.section-title {
    font-size: 1rem;
    font-weight: 500;
    margin: 10px 0;
    color: #666;
}

.filter-items {
    display: inline-block;
    flex-direction: column;
    padding: 0.5rem;
}

.category-item,
.filter-item {
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.category-item:hover,
.filter-item:hover {
    background: #f5f5f5;
}

.category-item.active,
.filter-item.active {
    background: #e0e0e0;
}

.filter-item {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem;
}

.filter-label {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    cursor: pointer;
}

.format-icon {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(50%);
    /* Makes the icon grey */
    transition: filter 0.2s ease;
}

.format-icon.selected {
    filter: brightness(0) saturate(100%);
    /* Black when selected */
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    padding: 0.5rem;
}

.color-swatch {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
    background-clip: content-box;
    border: 1px solid #ddd;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch.selected {
    padding: 2px;
    border: 2px solid #000;
}
</style>