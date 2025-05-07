<template>
    <InertiaHead :title="props.collectionName" />
    <div class="layout-container">
        <main class="main-content">

            <div class="content-wrapper">
                <h1 class="title">{{ collectionName }}</h1>
                <div class="flex justify-center items-center mb-4">
                    <Button icon="pi pi-filter" @click="layout?.toggleFilters()"
                        :label="layout?.isFiltersVisible?.value ? 'Hide Filters' : 'Filters'" severity="info"
                        size="large" class="filter-button" variant="outlined" raised />
                </div>

                <div v-if="!artworks.length" class="no-results">
                    <div v-if="artworksLoading" class="my-2 flex items-center justify-center">
                        <ProgressSpinner strokeWidth="3" animationDuration=".8s" class="loading-spinner" />
                    </div>
                    <div v-else>
                        <h2 class="text-xl font-semibold mb-2">No artworks found</h2>
                        <p class="text-gray-600">We didn't find any artworks, try another search term or remove filters
                        </p>
                    </div>
                </div>

                <DataView v-else :value="artworks" layout="grid">
                    <!-- Add header template for the filter button -->
                    <template #header>
                        <!-- <div class="flex justify-center items-center mb-4">
                            <Button icon="pi pi-filter" @click="layout?.toggleFilters()"
                                :label="layout?.isFiltersVisible?.value ? 'Hide Filters' : 'Filters'" severity="info"
                                size="large" class="filter-button" variant="outlined" raised />
                        </div> -->
                    </template>

                    <template #grid="slotProps">
                        <!-- Add progress overlay -->
                        <div v-if="artworksLoading" class="my-2 flex items-center justify-center">
                            <ProgressSpinner strokeWidth="3" animationDuration=".8s" class="loading-spinner" />
                        </div>
                        <div v-else class="grid grid-cols-12 gap-4 md:gap-12"> <!-- Reduced gap on mobile -->
                            <div v-for="(artwork, index) in slotProps.items" :key="index"
                                class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2">
                                <div class="rounded flex flex-col p-2 md:p-12 artwork-container"> <!-- Reduced padding on mobile -->
                                    <Link :href="`/artwork/${artwork.id}`" class="artwork-link">
                                        <div class="relative">
                                            <img v-if="artwork.urls?.img_thumb" 
                                                :src="artwork.urls.img_thumb"
                                                :alt="artwork.title?.en || 'Untitled'"
                                                class="rounded w-full h-auto object-contain max-h-[300px]" 
                                            />
                                            <div v-else class="no-image">No Image Available</div>
                                            
                                            <!-- Hover Overlay -->
                                            <div class="artwork-overlay">
                                                <div class="overlay-content">
                                                    <span class="artwork-title">{{ artwork.title.en }}</span>
                                                    <Divider layout="vertical" />
                                                    <span class="artwork-id">ID: {{ artwork.id }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>

                <!-- Replace the existing loading indicator -->
                <div v-if="loading && !artworksLoading" class="loading-container">
                    <ProgressSpinner strokeWidth="3" animationDuration=".8s" class="loading-spinner" />
                    <p class="loading-text">Loading more artworks...</p>
                </div>
            </div>
        </main>
    </div>
    <ScrollTop icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'secondary', raised: true, rounded: true, size: 'large' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, watch, inject } from "vue";
import axios from "axios";
import DataView from "primevue/dataview";
import Button from "primevue/button";
import { Link } from "@inertiajs/vue3";
import FilteredLayout from '@/layouts/FilteredLayout.vue';
import { ProgressSpinner, Divider } from "primevue";
import ScrollTop from 'primevue/scrolltop';
// import FilterSidebar from '@/components/FilterSidebar.vue';

import { router } from '@inertiajs/vue3'

// Add loading state for the entire page until the first set of artworks are loaded
router.on('start', (event) => {
    artworksLoading.value = true;
})

router.on('success', (event) => {
    artworksLoading.value = false;
})

defineOptions({ layout: FilteredLayout });

const props = defineProps({
    artworks: {
        type: Array,
        default: () => [],
    },
    collectionId: {
        type: String,
        default: null
    },
    collectionName: {
        type: String,
        default: 'Artworks'
    },
    filters: {
        type: Array,
        default: () => []
    },
    nextPage: {
        type: Number,
        default: null,
    }
});

const artworks = ref(Array.isArray(props.artworks) ? [...props.artworks] : []);
const loading = ref(false);
const artworksLoading = ref(false);
const nextPage = ref(props.nextPage);

// Get reference to the parent layout
const layout = inject('layout');

// Update buildUrl to use collectionId
const buildUrl = (page) => {
    let url = props.collectionId
        ? `/collection/${props.collectionId}`
        : '/artworks/data';

    // Add filters to URL if they exist
    if (props.filters.length > 0) {
        url += '/' + props.filters.join('/');
    }

    // Add query parameters
    url += `?page=${page}&per_page=30`;

    return url;
};

// Update loadMoreArtworks to use collectionId
const loadMoreArtworks = async () => {
    if (!nextPage.value || loading.value) return;

    loading.value = true;
    try {
        const response = await axios.get('/fetch-artworks', {
            params: {
                page: nextPage.value,
                per_page: 30,
                collection: props.collectionId, // Changed from collection to collectionId
                filters: props.filters
            }
        });

        if (response.data.artworks && response.data.artworks.length > 0) {
            artworks.value.push(...response.data.artworks);
            nextPage.value = response.data.nextPage;
        } else {
            nextPage.value = null;
        }
    } catch (error) {
        console.error("Error loading more artworks:", error);
    } finally {
        loading.value = false;
    }
};

const handleScroll = () => {
    const bottomOfWindow = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.offsetHeight;

    if (bottomOfWindow >= documentHeight - 500) {
        loadMoreArtworks();
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(() => props.artworks, (newArtworks) => {
    artworks.value = [...newArtworks];
});

watch(() => props.filters, () => {
    // Reset artworks when filters change
    artworks.value = [...props.artworks];
    nextPage.value = props.nextPage;
}, { deep: true });

</script>

<style scoped>
/* Replace existing flex styles with these */
.layout-container {
    display: flex;
    min-height: 100vh;
    /* background-color: #f8f9fa; */
}

.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.content-wrapper {
    /* max-width: 1600px; */
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.title {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
}

/* Adjust grid layout */
/* :deep(.grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
} */

/* Adjust artwork cards */
/* :deep(.artwork-card) {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
} */

/* :deep(.artwork-card:hover) {
    transform: translateY(-4px);
} */

/* Keep existing styles for no-image, loading, etc. */
.no-image {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    color: #888;
    font-size: 14px;
    border-radius: 8px;
}

.loading {
    text-align: center;
    padding: 10px;
    font-weight: bold;
}

.no-results {
    text-align: center;
    padding: 40px;
    /* background-color: #f9fafb; */
    border-radius: 8px;
    margin: 20px 0;
}

.filter-button {
    margin-bottom: 1rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
}

.loading-spinner {
    width: 50px;
    height: 50px;
}

.loading-text {
    color: #666;
    font-size: 0.875rem;
}

.progress-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* Add these new styles */
.artwork-link {
    display: block;
    width: 100%;
    text-align: center;
}

/* Adjust image container for better mobile display */
img {
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}

.artwork-container {
    position: relative;
    overflow: hidden;
}

.artwork-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.75rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    opacity: 0;
}

.artwork-container:hover .artwork-overlay {
    transform: translateY(0);
    opacity: 1;
}

.overlay-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #333;
}

.artwork-id, .artwork-title {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artwork-title {
    flex: 1;
}

/* Ensure the button doesn't trigger the Link navigation */
.p-button {
    z-index: 2;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .content-wrapper {
        padding: 1rem;
    }

    .title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
}
</style>
