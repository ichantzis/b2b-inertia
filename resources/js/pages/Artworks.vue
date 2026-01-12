<template>
    <InertiaHead :title="props.collectionName || 'Artworks'" />
    <div class="layout-container">
        <main class="main-content">
            <div class="content-wrapper">
                <div v-if="props.collectionId" class="collection-header mb-8">
                    <div v-if="props.collectionCover" :class="[
                        'mb-4 mx-auto',
                        props.isArtistPage ? 'artist-cover-wrapper' : 'collection-cover-image-wrapper'
                    ]">
                        <img :src="props.collectionCover" :alt="`Cover image for ${props.collectionName}`"
                            :class="props.isArtistPage ? 'artist-cover-image' : 'collection-cover-image'" />
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
                                    <Link :href="route('artwork.details', {
                                        id: artwork.id,
                                        slug: slugify(artwork.title?.en || 'artwork')
                                    })" class="artwork-link">
                                        <div class="relative">
                                            <img v-if="artwork.urls?.img_thumb" :src="artwork.urls.img_thumb"
                                                :alt="artwork.title?.en || 'Untitled'"
                                                class="rounded w-full h-auto object-contain max-h-[300px]" />
                                            <div v-else class="no-image">No Image Available</div>
                                            <div class="artwork-overlay">
                                                <div class="overlay-content">
                                                    <span class="artwork-title">{{ artwork.title?.en || 'Untitled'
                                                        }}</span>
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
import { debounce } from 'lodash-es';
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
import { slugify } from '@/composables/utils.js';

defineOptions({ layout: FilteredLayout });

const props = defineProps({
    artworks: { type: Array, default: () => [] },
    collectionId: { type: String, default: null },
    collectionSlug: { type: String, default: null },
    collectionName: { type: String, default: 'Artworks' },
    collectionCover: { type: String, default: null },
    collectionDescription: { type: String, default: null },
    filters: { type: Array, default: () => [] },
    currentSearchTerm: String,
    nextPage: { type: Number, default: null },
    initialOrder: { type: String, default: 'recommended' },
    isArtistPage: { type: Boolean, default: false }, // Added prop
});

const page = usePage();
const layout = inject('layout');

const localArtworks = ref([]);
const localNextPage = ref(null);
const loading = ref(false);
const artworksLoading = ref(false);
const localCurrentPageForLoadMore = ref(1);

const searchQuery = ref('');
const localCurrentSearchTerm = ref('');

const unregisterStartListener = router.on('start', () => artworksLoading.value = true);
const unregisterFinishListener = router.on('finish', () => artworksLoading.value = false);
const unregisterErrorListener = router.on('error', () => artworksLoading.value = false);

const performSearchRequest = (searchVal) => {
    artworksLoading.value = true;
    localCurrentSearchTerm.value = searchVal.trim();

    const queryParams = {
        search: localCurrentSearchTerm.value || undefined,
    };

    let baseRouteName = page.props.ziggy?.current_route_name || 'artworks';
    let routeParams = { ...page.props.ziggy?.parameters };

    if (props.filters && props.filters.length > 0 && !routeParams.filters) {
        routeParams.filters = props.filters.join('/');
    }
    if (baseRouteName === 'collection.show' && !routeParams.collection_slug && props.collectionSlug) {
        routeParams.collection_slug = props.collectionSlug;
    } else if (baseRouteName === 'list.filtered' && !routeParams.list_id && props.collectionId) {
        routeParams.list_id = props.collectionId;
    } else if (baseRouteName === 'artist.show' && !routeParams.artist_id && props.collectionId) {
        routeParams.artist_id = props.collectionId;
    }

    router.get(route(baseRouteName, routeParams), queryParams, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onSuccess: (newPage) => {
            searchQuery.value = newPage.props.currentSearchTerm || '';
            localCurrentSearchTerm.value = newPage.props.currentSearchTerm || '';
        },
        onFinish: () => {
        }
    });
};

const debouncedPerformSearch = debounce((newValue) => {
    performSearchRequest(newValue);
}, 1000);

watch(searchQuery, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        debouncedPerformSearch(newValue);
    }
});

const clearSearch = () => {
    searchQuery.value = '';
};

onMounted(() => {
    localArtworks.value = Array.isArray(props.artworks) ? [...props.artworks] : [];
    localNextPage.value = props.nextPage;
    localCurrentPageForLoadMore.value = props.nextPage ? props.nextPage - 1 : (props.artworks.length > 0 ? 1 : null);
    searchQuery.value = props.currentSearchTerm || '';
    localCurrentSearchTerm.value = props.currentSearchTerm || '';

    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    unregisterStartListener();
    unregisterFinishListener();
    unregisterErrorListener();
});

watch(() => props.artworks, (newArtworks) => {
    if (!loading.value) {
        localArtworks.value = Array.isArray(newArtworks) ? [...newArtworks] : [];
    }
}, { deep: true });

watch(() => props.nextPage, (newNextPage) => {
    localNextPage.value = newNextPage;
    localCurrentPageForLoadMore.value = newNextPage ? newNextPage - 1 : (localArtworks.value.length > 0 ? 1 : null);
});

watch(() => props.currentSearchTerm, (newSearchTerm) => {
    searchQuery.value = newSearchTerm || '';
    localCurrentSearchTerm.value = newSearchTerm || '';
});

const loadMoreArtworks = async () => {
    if (!localNextPage.value || loading.value) return;

    loading.value = true;
    try {
        let baseRouteName = page.props.ziggy?.current_route_name || 'artworks';

        const response = await axios.get(route('artworks.fetch'), {
            params: {
                page: localNextPage.value,
                per_page: 30,
                collection_id: baseRouteName === 'collection.show' ? props.collectionId : null,
                list_id: baseRouteName === 'list.filtered' ? props.collectionId : null,
                artist_id: baseRouteName === 'artist.show' ? props.collectionId : null,
                filters: props.filters?.join('/'),
                order: props.initialOrder,
                search: localCurrentSearchTerm.value || undefined,
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

const handleScroll = debounce(() => {
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
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

/* Collection Header Styles */
.collection-header {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 2rem;
}

/* Standard Collection Banner Style */
.collection-cover-image-wrapper {
    max-height: 400px;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
}

.collection-cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Artist Profile Circular Style */
.artist-cover-wrapper {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    /* Circular mask */
    overflow: hidden;
    background-color: #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 4px solid white;
    /* White border to make it pop */
    display: flex;
    justify-content: center;
    align-items: center;
}

.artist-cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.collection-description {
    line-height: 1.6;
}

/* Filter button */
/* .filter-button {
} */

/* Artworks Grid & Cards */
.artwork-container {
    position: relative;
    overflow: hidden;
    padding: 0.5rem;
    border-radius: 6px;
}

.artwork-link {
    display: block;
    width: 100%;
    text-align: center;
}

.artwork-container img {
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 4px;
}

.artwork-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem;
    transform: translateY(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    border-top: 1px solid #eee;
}

.artwork-container:hover .artwork-overlay {
    transform: translateY(0);
    opacity: 1;
}

.overlay-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    color: #333;
}

.artwork-id,
.artwork-title {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artwork-title {
    flex-grow: 1;
    text-align: left;
}

.artwork-id {
    flex-shrink: 0;
    color: #555;
}

/* No results and loading states */
.no-results {
    text-align: center;
    padding: 40px 20px;
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
}

.loading-spinner {
    width: 40px;
    height: 40px;
}

.loading-text {
    color: #666;
    font-size: 0.875rem;
}

.no-image {
    width: 100%;
    aspect-ratio: 1/1;
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

/* Responsive adjustments */
@media (max-width: 768px) {
    .main-content {
        padding: 0rem 1rem;
    }

    .content-wrapper {
        padding: 1.5rem;
    }

    .collection-title {
        font-size: 2xl;
    }

    .collection-description {
        font-size: sm;
    }
}

@media (max-width: 640px) {
    .content-wrapper {
        padding: 1rem;
    }

    .collection-header {
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .collection-title {
        font-size: xl;
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