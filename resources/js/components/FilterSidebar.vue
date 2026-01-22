<template>
    <aside class="filter-sidebar">
        <div class="filter-section">
            <h3 class="filter-title">Sort Order</h3>
            <div class="filter-items">
                <Select v-model="activeSort" :options="sortOptions" optionLabel="label" optionValue="value"
                    placeholder="Select Sort Order" class="w-full" @change="handleSortChange" />
            </div>
        </div>

        <div class="filter-section">
            <h3 class="filter-title">Categories</h3>
            <div class="filter-items">
                <div v-for="(sectionItems, sectionName) in categories" :key="sectionName" class="category-section">
                    <h4 class="section-title capitalize">{{ sectionName }}</h4>
                    <div class="category-grid">
                        <span v-for="category in sectionItems" :key="category.id" class="filter-item">
                            <Checkbox 
                                :value="buildCategoryUrl(category)" 
                                v-model="activeCategory"
                                @change="() => handleCategoryChange(category)" 
                                :pt="{ root: { class: 'mr-2' } }" 
                                size="small"
                                :inputId="`category-${category.id}`" 
                            />
                            <label :for="`category-${category.id}`" class="filter-label text-sm">
                                {{ category.name }}
                            </label>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="filter-section">
            <h3 class="filter-title">Geometry</h3>
            <div class="filter-items">
                <span v-for="format in formats" :key="format.value" class="filter-item">
                    <Checkbox :value="format.value" v-model="activeFormat"
                        @change="() => handleFormatChange(format.value)" :pt="{ root: { class: 'mr-2' } }" size="small"
                        :inputId="format.value" />
                    <label :for="format.value" class="filter-label">
                        <img :src="format.icon" :alt="format.label" class="format-icon"
                            :class="{ 'selected': activeFormat.includes(format.value) }" />
                    </label>
                </span>
            </div>
        </div>

        <div class="filter-section">
            <h3 class="filter-title">Colors</h3>
            <div class="color-grid">
                <span v-for="color in colors" :key="color.value" class="color-swatch"
                    :class="{ 'selected': activeColor.includes(color.value) }" :style="{ backgroundColor: color.hex }"
                    @click="() => handleColorChange(color.value)" :title="color.label">
                </span>
            </div>
        </div>

        <div class="flex justify-center items-center mb-4 mt-6">
            <Button icon="pi pi-eraser" @click="clearFilters" label="Clear Filters" severity="info" size="medium"
                class="filter-button" variant="outlined" raised />
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import Button from 'primevue/button'; // Ensure Button is imported

const props = defineProps({
    listId: [String, Number], // Can be number or string from DB
    collectionSlug: String,
    activeFilters: {
        type: Array,
        default: () => []
    },
    currentSearchQuery: {
        type: String,
        default: ''
    }
});

const page = usePage();

// --- DATA SOURCES ---

// Get Categories directly from Shared Props (Middleware)
const categories = computed(() => {
    const rawCategories = page.props.global_data?.categories || [];
    const groups = {};

    // Group categories by their parent_slug (e.g. 'subjects', 'styles')
    // If no parent_slug exists, group under 'All Categories'
    rawCategories.forEach(cat => {
        // Format the key (e.g. 'subjects' -> 'Subjects')
        let key = 'Categories';
        if (cat.parent_slug) {
            key = cat.parent_slug.charAt(0).toUpperCase() + cat.parent_slug.slice(1);
        }
        
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(cat);
    });

    return groups;
});

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

const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Recently Added', value: 'recently_added' },
    { label: 'Best Selling', value: 'best_selling' },
    { label: 'Trending', value: 'trending' },
    { label: 'Oldest First', value: 'oldest_first' }
];

// --- ACTIVE STATE COMPUTED ---

const activeCategory = computed({
    get: () => {
        // Looks for 'cat_abstract', 'cat_landscape' etc.
        const category = props.activeFilters.find(f => f.startsWith('cat_'));
        return category ? [category] : [];
    },
    set: () => { } 
});

const activeFormat = computed({
    get: () => {
        const format = props.activeFilters.find(f => ['horizontal', 'vertical', 'square', 'panorama'].includes(f));
        return format ? [format] : [];
    },
    set: () => { }
});

const activeColor = computed({
    get: () => {
        const color = props.activeFilters.find(f => colors.map(c => c.value).includes(f));
        return color ? [color] : [];
    },
    set: () => { }
});

const activeSort = computed({
    get: () => {
        const sort = props.activeFilters.find(f => sortOptions.map(o => o.value).includes(f));
        return sort || 'recommended';
    },
    set: () => { }
});


// --- URL & LOGIC HELPERS ---

const getBaseUrl = () => {
    const currentPath = page.url;    
    
    // Logic for Collections
    if (currentPath.startsWith('/collection/') && props.collectionSlug) {
        return `/collection/${props.collectionSlug}`;
    }
    // Logic for Lists
    if (currentPath.startsWith('/lists/') && props.collectionSlug) {
         // Using slug for lists now based on route definition
        return `/lists/${props.collectionSlug}`;
    }
    // Logic for Artists
    if (currentPath.startsWith('/artist/') && props.collectionSlug) {
        return `/artist/${props.collectionSlug}`;
    }
    
    return '/artworks';
};

const updateUrl = (pathFiltersArray) => {
    // Filter out empty values and join
    const cleanPathFilters = pathFiltersArray.filter(f => f).join('/');
    const baseUrl = getBaseUrl();
    
    // Build target URL (e.g., /artworks/cat_blue/horizontal)
    const targetUrl = cleanPathFilters ? `${baseUrl}/${cleanPathFilters}` : baseUrl;

    const queryParams = {};
    if (props.currentSearchQuery) {
        queryParams.search = props.currentSearchQuery;
    }

    router.visit(targetUrl, {
        data: queryParams,
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};

const buildCategoryUrl = (category) => {
    // Check if category has a parent_slug (e.g. 'illustration')
    if (category.parent_slug) {
        // Format: cat_parent_child (e.g. cat_illustration_abstract)
        return `cat_${category.parent_slug}_${category.slug}`;
    }
    // Fallback for top-level categories
    return `cat_${category.slug}`;
};

const handleCategoryChange = (category) => {
    const newCategorySlug = buildCategoryUrl(category);
    
    // Remove any EXISTING category filter (assuming single category select)
    // We filter out any string starting with 'cat_'
    let otherFilters = props.activeFilters.filter(f => !f.startsWith('cat_'));

    // Check if we are DESELECTING the current category
    const isCurrentlyActive = props.activeFilters.includes(newCategorySlug);

    if (isCurrentlyActive) {
        // Just send the other filters (clearing category)
        updateUrl(otherFilters);
    } else {
        // Add new category + other filters
        updateUrl([newCategorySlug, ...otherFilters]);
    }
};

const handleFormatChange = (formatValue) => {
    // Remove existing format
    let otherFilters = props.activeFilters.filter(f => !formats.map(opt => opt.value).includes(f));
    
    if (props.activeFilters.includes(formatValue)) {
        updateUrl(otherFilters);
    } else {
        updateUrl([formatValue, ...otherFilters]);
    }
};

const handleColorChange = (colorValue) => {
    // Remove existing colors (if single select) or keep if multi select?
    // Implementation suggests single select per type logic in original code
    let otherFilters = props.activeFilters.filter(f => !colors.map(opt => opt.value).includes(f));
    
    if (props.activeFilters.includes(colorValue)) {
        updateUrl(otherFilters);
    } else {
        updateUrl([colorValue, ...otherFilters]);
    }
};

const handleSortChange = (event) => {
    const newSortValue = event.value;
    let otherFilters = props.activeFilters.filter(f => !sortOptions.map(o => o.value).includes(f));

    if (newSortValue && newSortValue !== 'recommended') {
        otherFilters = [newSortValue, ...otherFilters];
    }
    updateUrl(otherFilters);
};

const clearFilters = () => {
    const baseUrl = getBaseUrl();
    const queryParams = {};
    if (props.currentSearchQuery) {
        queryParams.search = props.currentSearchQuery;
    }
    
    router.visit(baseUrl, {
        data: queryParams,
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};
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

/* Add these styles */
:deep(.p-dropdown) {
    width: 100%;
    margin: 0.5rem;
}

:deep(.p-dropdown-label) {
    font-size: 0.9rem;
}
</style>