<template>
    <InertiaHead :title="props.collectionName || 'Artworks'" />
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

                <div class="mb-6 px-4 md:px-0 max-w-xl mx-auto">
                    <IconField iconPosition="left" class="w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="searchQuery" placeholder="Search for artworks..."
                            class="w-full p-inputtext-lg" aria-label="Search artworks" />
                        <InputIcon v-if="searchQuery || localCurrentSearchTerm"
                            class="pi pi-times cursor-pointer text-gray-500 hover:text-gray-700"
                            aria-label="Clear Search" @click="clearSearch" tabindex="0" @keydown.enter="clearSearch"
                            @keydown.space="clearSearch" />
                    </IconField>
                </div>

                <div class="flex justify-center items-center mb-6">
                    <Button icon="pi pi-filter" @click="layout?.toggleFilters()"
                        :label="layout?.isFiltersVisible?.value ? 'Hide Filters' : 'Filters'" severity="info"
                        size="large" class="filter-button" variant="outlined" raised />
                </div>

                <div v-if="artworksLoading && !artworks.length"
                    class="my-2 flex items-center justify-center col-span-full">
                    <ProgressSpinner strokeWidth="3" animationDuration=".8s" class="loading-spinner" />
                </div>
                <div v-else-if="!artworks.length && !artworksLoading" class="no-results text-center py-10">
                    <h2 class="text-xl font-semibold mb-2">No artworks found</h2>
                    <p class="text-gray-600">We didn't find any artworks matching your criteria. Try another search term
                        or adjust your filters.</p>
                </div>

                <DataView v-else :value="artworks" layout="grid">
                    <template #grid="slotProps">
                        <div class="grid grid-cols-12 gap-4 md:gap-8">
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

                <div v-if="loading && localNextPage" class="loading-container">
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
import { ref, onMounted, onUnmounted, defineProps, watch, inject, computed } from "vue";
import axios from "axios";
import { debounce } from 'lodash-es'; // Import debounce from lodash-es
import DataView from "primevue/dataview";
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import { Link, Head as InertiaHead, router, usePage } from "@inertiajs/vue3";
import FilteredLayout from '@/layouts/FilteredLayout.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import ScrollTop from 'primevue/scrolltop';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';


defineOptions({ layout: FilteredLayout });

const props = defineProps({
    artworks: { type: Array, default: () => [] },
    collectionId: { type: String, default: null },
    collectionSlug: { type: String, default: null },
    collectionName: { type: String, default: 'Artworks' },
    collectionCover: { type: String, default: null },
    collectionDescription: { type: String, default: null },
    filters: { type: Array, default: () => [] },
    currentSearchTerm: String, // From controller, reflecting URL query
    nextPage: { type: Number, default: null },
    initialOrder: { type: String, default: 'recommended' },
});

const page = usePage();
const layout = inject('layout');

const localArtworks = ref([]);
const localNextPage = ref(null);
const loading = ref(false); // For "load more"
const artworksLoading = ref(false); // For initial/filter/search main content load
const localCurrentPageForLoadMore = ref(1);

const searchQuery = ref(''); // Bound to the InputText
const localCurrentSearchTerm = ref(''); // The term that was actually searched for

// --- Inertia Event Handlers for global loading state ---
const unregisterStartListener = router.on('start', () => artworksLoading.value = true);
const unregisterFinishListener = router.on('finish', () => artworksLoading.value = false);
const unregisterErrorListener = router.on('error', () => artworksLoading.value = false);


const performSearchRequest = (searchVal) => {
    artworksLoading.value = true;
    localCurrentSearchTerm.value = searchVal.trim();

    const queryParams = {
        search: localCurrentSearchTerm.value || undefined,
        // page: 1 // Reset to page 1 for a new search
    };

    let baseRouteName = page.props.ziggy?.current_route_name || 'artworks'; // Default to 'artworks'
    let routeParams = { ...page.props.ziggy?.parameters }; // Copy existing route parameters

    // If filters are part of path and not ziggy params, ensure they are included
    if (props.filters && props.filters.length > 0 && !routeParams.filters) {
        routeParams.filters = props.filters.join('/');
    }
    // Ensure specific IDs are present if on specific pages
    if (baseRouteName === 'collection.show' && !routeParams.collection_slug && props.collectionSlug) {
        routeParams.collection_slug = props.collectionSlug;
    } else if (baseRouteName === 'list.filtered' && !routeParams.list_id && props.collectionId) {
        routeParams.list_id = props.collectionId; // Assuming collectionId is list_id for this route
    }


    router.get(route(baseRouteName, routeParams), queryParams, {
        preserveState: true,
        preserveScroll: true, // Let Inertia manage scroll on success, or handle manually
        replace: true,
        onSuccess: (newPage) => {
            // Data (artworks, nextPage, currentSearchTerm) will be updated via props.
            // Update local searchQuery to match the actual searched term from the backend response.
            searchQuery.value = newPage.props.currentSearchTerm || '';
            localCurrentSearchTerm.value = newPage.props.currentSearchTerm || '';
        },
        onFinish: () => {
            // artworksLoading.value = false; // Already handled by global listener
        }
    });
};

// Create the debounced version of performSearchRequest
const debouncedPerformSearch = debounce((newValue) => {
    performSearchRequest(newValue);
}, 1000); // 1000ms = 1 second delay

// Watch the searchQuery model for changes
watch(searchQuery, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        debouncedPerformSearch(newValue);
    }
});

const clearSearch = () => {
    searchQuery.value = ''; // This will trigger the watcher and then debouncedPerformSearch
    // performSearchRequest(''); // Or call directly if immediate clearing is desired
};

// --- Lifecycle and Data Handling ---
onMounted(() => {
    localArtworks.value = Array.isArray(props.artworks) ? [...props.artworks] : [];
    localNextPage.value = props.nextPage;
    localCurrentPageForLoadMore.value = props.nextPage ? props.nextPage - 1 : (props.artworks.length > 0 ? 1 : null);
    searchQuery.value = props.currentSearchTerm || ''; // Initialize from prop
    localCurrentSearchTerm.value = props.currentSearchTerm || '';

    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    // Unregister Inertia listeners
    unregisterStartListener();
    unregisterFinishListener();
    unregisterErrorListener();
});

// Watch props to update local state when Inertia navigates
watch(() => props.artworks, (newArtworks) => {
    if (!loading.value) { // Avoid race condition with loadMore
        localArtworks.value = Array.isArray(newArtworks) ? [...newArtworks] : [];
    }
}, { deep: true });

watch(() => props.nextPage, (newNextPage) => {
    localNextPage.value = newNextPage;
    localCurrentPageForLoadMore.value = newNextPage ? newNextPage - 1 : (localArtworks.value.length > 0 ? 1 : null);
});

watch(() => props.currentSearchTerm, (newSearchTerm) => {
    // This ensures that if navigation changes the search term (e.g. back button, header search if implemented later)
    // the local searchQuery and localCurrentSearchTerm reflect it.
    searchQuery.value = newSearchTerm || '';
    localCurrentSearchTerm.value = newSearchTerm || '';
});


const loadMoreArtworks = async () => {
    if (!localNextPage.value || loading.value) return;

    loading.value = true;
    try {
        const response = await axios.get(route('artworks.fetch'), {
            params: {
                page: localNextPage.value,
                per_page: 30, // Or your configured per_page
                collection_id: props.collectionId,
                filters: props.filters?.join('/'),
                order: props.initialOrder, // or a reactive order ref
                search: localCurrentSearchTerm.value || undefined, // Use the actual searched term
            }
        });

        if (response.data.artworks && response.data.artworks.length > 0) {
            localArtworks.value.push(...response.data.artworks);
            localNextPage.value = response.data.nextPage;
            localCurrentPageForLoadMore.value = response.data.nextPage ? response.data.nextPage - 1 : null;
        } else {
            localNextPage.value = null;
        }
    } catch (error) {
        console.error("Error loading more artworks:", error);
    } finally {
        loading.value = false;
    }
};

const handleScroll = debounce(() => { // Also debounce scroll handler slightly
    const bottomOfWindow = window.innerHeight + window.pageYOffset;
    const documentHeight = document.documentElement.offsetHeight;
    if (bottomOfWindow >= documentHeight - 500 && localNextPage.value && !loading.value) {
        loadMoreArtworks();
    }
}, 200);

const artworks = computed(() => localArtworks.value);

</script>


<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 2rem 2rem;
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

.p-input-icon-left>.p-inputtext {
    padding-left: 2.5rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
}


/* Responsive adjustments */
@media (max-width: 768px) {

    /* md breakpoint */
    .main-content {
        padding: 0rem 1rem;
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