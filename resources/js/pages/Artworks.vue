<template>
    <InertiaHead :title="props.collectionName" />
    <div class="layout-container">
        <main class="main-content">
            <div class="content-wrapper">
                <div v-if="props.collectionId" class="collection-header mb-8">
                    <div v-if="props.collectionCover" class="collection-cover-image-wrapper mb-4">
                        <img :src="props.collectionCover" :alt="`Cover image for ${props.collectionName}`"
                            class="collection-cover-image" />
                    </div>
                    <h1 class="collection-title text-3xl md:text-4xl font-bold text-center mb-2">{{ props.collectionName
                        }}</h1>
                    <p v-if="props.collectionDescription"
                        class="collection-description text-center text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
                        {{ props.collectionDescription }}
                    </p>
                </div>
                <div class="flex justify-center items-center mb-6">
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
                        <p class="text-gray-600">We didn't find any artworks, try another search term or remove filters.
                        </p>
                    </div>
                </div>

                <DataView v-else :value="artworks" layout="grid">
                    <template #grid="slotProps">
                        <div v-if="artworksLoading && !slotProps.items.length"
                            class="my-2 flex items-center justify-center col-span-full">
                            <ProgressSpinner strokeWidth="3" animationDuration=".8s" class="loading-spinner" />
                        </div>
                        <div v-else class="grid grid-cols-12 gap-4 md:gap-8">
                            <div v-for="(artwork, index) in slotProps.items" :key="artwork.id || index"
                                class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2">
                                <div class="rounded flex flex-col artwork-container">
                                    <Link :href="`/artwork/${artwork.id}`" class="artwork-link">
                                    <div class="relative">
                                        <img v-if="artwork.urls?.img_thumb" :src="artwork.urls.img_thumb"
                                            :alt="artwork.title?.en || 'Untitled'"
                                            class="rounded w-full h-auto object-contain max-h-[300px]" />
                                        <div v-else class="no-image">No Image Available</div>

                                        <div class="artwork-overlay">
                                            <div class="overlay-content">
                                                <span class="artwork-title">{{ artwork.title?.en || 'Untitled' }}</span>
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

                <div v-if="loading && nextPage" class="loading-container">
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
import { ref, onMounted, onUnmounted, defineProps, watch, inject, computed } from "vue"; // Added computed
import axios from "axios";
import DataView from "primevue/dataview";
import Button from "primevue/button";
import { Link, Head as InertiaHead } from "@inertiajs/vue3"; // Added Head
import FilteredLayout from '@/layouts/FilteredLayout.vue';
// import { ProgressSpinner, Divider } from "primevue"; // Already imported in your version
import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import ScrollTop from 'primevue/scrolltop';

import { router } from '@inertiajs/vue3'

router.on('start', () => { // Removed event parameter as it's not used
    artworksLoading.value = true;
})

router.on('finish', () => { // Changed from 'success' to 'finish' to cover all navigation ends
    artworksLoading.value = false;
})

defineOptions({ layout: FilteredLayout });

const props = defineProps({
    artworks: {
        type: Array,
        default: () => [],
    },
    collectionId: { // This is the actual ID, not the slug
        type: String,
        default: null
    },
    collectionSlug: { // Keep this if you build filter URLs using the slug
        type: String,
        default: null,
    },
    collectionName: {
        type: String,
        default: 'Artworks'
    },
    collectionCover: {
        type: String,
        default: null
    },
    collectionDescription: {
        type: String,
        default: null
    },
    filters: { // These are the filter segments from the URL path
        type: Array,
        default: () => []
    },
    nextPage: {
        type: Number,
        default: null,
    },
    initialOrder: { // To set the initial state of an order dropdown if you have one
        type: String,
        default: 'recommended',
    }
});

const artworksData = ref(Array.isArray(props.artworks) ? [...props.artworks] : []); // Renamed to avoid conflict
const loading = ref(false); // For loading more, not initial load
const artworksLoading = ref(false); // For initial page load or filter changes
const currentPage = ref(props.nextPage ? props.nextPage - 1 : 1); // Keep track of current page, assuming nextPage is the one to fetch

// Get reference to the parent layout
const layout = inject('layout');


// Watch for prop changes to reset artworksData and nextPage
watch(() => props.artworks, (newArtworks) => {
    artworksData.value = Array.isArray(newArtworks) ? [...newArtworks] : [];
    currentPage.value = props.nextPage ? props.nextPage - 1 : 1; // Reset page based on initial load
}, { deep: true });

watch(() => props.filters, () => {
    // Assuming filters prop change means a new set of initial artworks is loaded by Inertia
    artworksData.value = Array.isArray(props.artworks) ? [...props.artworks] : [];
    currentPage.value = props.nextPage ? props.nextPage - 1 : 1;
}, { deep: true });


const loadMoreArtworks = async () => {
    if (!props.nextPage || loading.value || !currentPage.value) return; // Ensure currentPage is valid

    loading.value = true;
    try {
        const response = await axios.get(route('artworks.fetch'), { // Use named route for fetching
            params: {
                page: currentPage.value + 1, // Fetch the actual next page
                per_page: 30,
                collection_id: props.collectionId, // Pass collection_id
                filters: props.filters.join('/'), // Pass filters as a string if your backend expects that
                order: props.initialOrder, // Maintain current order
            }
        });

        if (response.data.artworks && response.data.artworks.length > 0) {
            artworksData.value.push(...response.data.artworks);
            currentPage.value = response.data.nextPage ? response.data.nextPage - 1 : null; // Update current page based on the new nextPage
        } else {
            currentPage.value = null; // No more pages
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

    if (bottomOfWindow >= documentHeight - 500) { // Trigger a bit earlier
        if (currentPage.value !== null) { // Only load if there's a next page
            loadMoreArtworks();
        }
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    // Set initial currentPage based on props.nextPage
    currentPage.value = props.nextPage ? props.nextPage - 1 : (props.artworks.length > 0 ? 1 : null);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// Make artworks a computed property to reflect changes from props and loadMore
const artworks = computed(() => artworksData.value);

</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 1rem 2rem;
    /* Adjusted padding */
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    /* Ensure padding for content */
}

/* Collection Header Styles */
.collection-header {
    border-bottom: 1px solid #e5e7eb;
    /* Subtle separator */
    padding-bottom: 2rem;
}

.collection-cover-image-wrapper {
    max-height: 400px;
    /* Limit height of cover */
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    /* Rounded corners for the image */
    display: flex;
    /* Center image if it's not full width */
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    /* Placeholder if image is smaller */
}

.collection-cover-image {
    width: 100%;
    /* Make image responsive */
    height: 100%;
    object-fit: cover;
    /* Cover the area, might crop */
}

.collection-title {
    /* Tailwind classes used in template, specific styles if needed */
}

.collection-description {
    /* Tailwind classes used in template */
    line-height: 1.6;
}


/* Filter button */
.filter-button {
    /* margin-bottom: 1rem; */
    /* Original style */
}

/* Artworks Grid & Cards */
.artwork-container {
    position: relative;
    overflow: hidden;
    /* background: #f9f9f9; */
    /* Light background for card area */
    padding: 0.5rem;
    /* Small padding inside the container */
    border-radius: 6px;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
}

.artwork-link {
    display: block;
    width: 100%;
    text-align: center;
}

.artwork-container img {
    /* Ensure images inside link are responsive */
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 4px;
    /* Slightly rounded images */
}

.artwork-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    /* Slightly less transparent */
    padding: 0.75rem;
    transform: translateY(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    /* Added opacity transition */
    opacity: 0;
    border-top: 1px solid #eee;
    /* Separator for overlay */
}

.artwork-container:hover .artwork-overlay {
    transform: translateY(0);
    opacity: 1;
}

.overlay-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* Space out title and ID */
    gap: 0.5rem;
    /* Reduced gap */
    color: #333;
}

.artwork-id,
.artwork-title {
    font-size: 0.8rem;
    /* Slightly smaller font */
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artwork-title {
    flex-grow: 1;
    /* Allow title to take available space */
    text-align: left;
}

.artwork-id {
    flex-shrink: 0;
    /* Prevent ID from shrinking too much */
    color: #555;
}


/* No results and loading states */
.no-results {
    text-align: center;
    padding: 40px 20px;
    /* Added horizontal padding */
    border-radius: 8px;
    margin: 20px 0;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
    width: 100%;
    /* Ensure it takes full width */
}

.loading-spinner {
    width: 40px;
    /* Slightly smaller spinner */
    height: 40px;
}

.loading-text {
    color: #666;
    font-size: 0.875rem;
}

.no-image {
    /* Style for when artwork image is missing */
    width: 100%;
    aspect-ratio: 1/1;
    /* Maintain square or defined aspect ratio */
    max-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    color: #888;
    font-size: 14px;
    border-radius: 4px;
}


/* Responsive adjustments */
@media (max-width: 768px) {

    /* md breakpoint */
    .main-content {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1.5rem;
    }

    .collection-title {
        font-size: 2xl;
        /* Tailwind equivalent for text-2xl */
    }

    .collection-description {
        font-size: sm;
        /* Tailwind equivalent for text-sm */
    }
}

@media (max-width: 640px) {

    /* sm breakpoint */
    .content-wrapper {
        padding: 1rem;
    }

    .collection-header {
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .collection-title {
        font-size: xl;
        /* Tailwind equivalent for text-xl */
    }

    .artwork-container {
        padding: 0.25rem;
    }

    .artwork-overlay {
        padding: 0.5rem;
    }

    .artwork-id,
    .artwork-title {
        font-size: 0.75rem;
    }
}
</style>