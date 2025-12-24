<script setup>
import { ref, computed, onMounted } from 'vue';
import { Link, Head as InertiaHead, router } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';

defineOptions({ layout: HeaderLayout });

const props = defineProps({
    activeTab: {
        type: String,
        default: 'overview'
    },
    rows: {
        type: Array,
        default: () => []
    },
    gridItems: {
        type: Array,
        default: () => []
    }
});

// Define Menu Items with Commands for Inertia Navigation
const items = ref([
    { label: 'Overview', id: 'overview', route: 'artists.overview' },
    { label: 'Illustrators', id: 'illustrators', route: 'artists.illustrators' },
    { label: 'Photographers', id: 'photographers', route: 'artists.photographers' },
    { label: 'By Country', id: 'by-country', route: 'artists.by_country' },
]);

// Determine active index based on the current activeTab prop
const activeIndex = computed(() => {
    return items.value.findIndex(item => item.id === props.activeTab);
});

// Handle Tab Change
const onTabChange = (e) => {
    const item = items.value[e.index];
    if (item && item.route) {
        router.visit(route(item.route));
    }
};

const decodeHTMLEntities = (text) => {
    if (typeof text !== 'string') return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};
</script>

<template>
    <InertiaHead title="Artists" />

    <div class="page-container">
        <div class="main-content-area">
            <div class="content-wrapper">
                
                <h1 class="text-3xl font-bold mb-10 text-center text-gray-900">Artists</h1>

                <div class="mb-12">
                    <TabMenu 
                        :model="items" 
                        :activeIndex="activeIndex"
                        @tab-change="onTabChange"
                        class="flex justify-center"
                    />
                </div>

                <div v-if="rows.length > 0">
                     <div v-for="(row, index) in rows" :key="index" class="mb-12">
                        <div class="flex justify-between items-end mb-4 px-1">
                            <h2 class="text-xl font-bold text-gray-800">{{ row.title }}</h2>
                        </div>

                        <div class="horizontal-scroll-wrapper">
                            <div class="artists-row">
                                <div v-for="artist in row.items" :key="artist.artist_id" class="artist-item-wrapper">
                                    <Link :href="route('artist.show', { artist_slug: artist.username })" class="block link-wrapper">
                                        <Card class="artist-card p-0">
                                            <template #header>
                                                <div class="card-image-container">
                                                    <div class="image-wrapper">
                                                        <img 
                                                            v-if="artist.profile_picture" 
                                                            :src="artist.profile_picture" 
                                                            :alt="artist.name" 
                                                            class="artist-image" 
                                                            loading="lazy" 
                                                        />
                                                        <div v-else class="image-placeholder">
                                                            <i class="pi pi-user text-3xl"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <template #title>
                                                <h3 class="name-heading text-sm font-semibold text-center mt-3 mb-1 px-1">
                                                    {{ decodeHTMLEntities(artist.name) }}
                                                </h3>
                                            </template>
                                            <template #content>
                                                <div class="text-center pb-3">
                                                    <p class="text-xs text-gray-500 truncate w-full px-1">
                                                        {{ artist.artist_type }}
                                                    </p>
                                                    <p class="text-xs text-gray-400 mt-0.5">
                                                        {{ artist.artworks }} Artworks
                                                    </p>
                                                </div>
                                            </template>
                                        </Card>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="gridItems.length > 0" class="mt-8 pt-8 border-t border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800 mb-6">All {{ activeTab === 'illustrators' ? 'Illustrators' : 'Photographers' }}</h2>
                    <div class="artists-grid">
                        <div v-for="artist in gridItems" :key="artist.artist_id" class="artist-grid-item">
                            <Link :href="route('artist.show', { artist_slug: artist.username })" class="block h-full link-wrapper">
                                <Card class="artist-card h-full p-0 overflow-hidden">
                                    <template #header>
                                        <div class="card-image-container">
                                            <div class="image-wrapper">
                                                <img 
                                                    v-if="artist.profile_picture" 
                                                    :src="artist.profile_picture" 
                                                    :alt="artist.name" 
                                                    class="artist-image" 
                                                    loading="lazy" 
                                                />
                                                <div v-else class="image-placeholder">
                                                    <i class="pi pi-user text-3xl"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #title>
                                        <div class="name-heading text-sm font-semibold text-center mt-3 mb-1 px-1">
                                            {{ decodeHTMLEntities(artist.name) }}
                                        </div>
                                    </template>
                                    <template #content>
                                        <div class="text-center pb-3">
                                            <p class="text-xs text-gray-500 truncate w-full px-1">
                                                {{ artist.artist_type }}
                                            </p>
                                            <div class="text-xs text-gray-400 mt-0.5">
                                                {{ artist.artworks }} artworks
                                            </div>
                                        </div>
                                    </template>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'overview'" class="text-center mt-12 mb-8">
                    <Link :href="route('artists.all')">
                        <Button label="See all artists" size="large" outlined class="w-full sm:w-auto" />
                    </Link>
                </div>

                <div v-if="rows.length === 0 && gridItems.length === 0" class="text-center py-20 text-gray-500">
                    No artists found in this category.
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ensure these match your layout's structure */
.page-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    display: flex;
}

.main-content-area {
    flex-grow: 1;
    padding: 2rem;
    width: 100%;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1400px;
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

/* Horizontal Scroll Styling */
.horizontal-scroll-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0 1.5rem 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}
.horizontal-scroll-wrapper::-webkit-scrollbar {
    height: 6px;
}
.horizontal-scroll-wrapper::-webkit-scrollbar-track {
    background: transparent;
}
.horizontal-scroll-wrapper::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

.artists-row {
    display: flex;
    gap: 2rem;
}

.artist-item-wrapper {
    flex: 0 0 auto;
    width: 180px;
}

/* Card Styling */
.artist-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid transparent;
    overflow: hidden;
    background: white;
}

.artist-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb;
}
.artist-card:hover .name-heading {
    color: var(--p-primary-color, #3B82F6);
}

.link-wrapper {
    text-decoration: none;
    color: inherit;
}

.card-image-container {
    padding-top: 1.5rem;
    display: flex;
    justify-content: center;
    width: 100%;
}

.image-wrapper {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 3px solid white;
}

.artist-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
}

.name-heading {
    color: #1f2937;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
}

/* PrimeVue Overrides */
:deep(.p-card-body) {
    padding: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
:deep(.p-card-content) {
    padding: 0;
}

/* Customizing PrimeVue TabMenu */
:deep(.p-tabmenu-tablist) {
    flex-wrap: wrap;
    justify-content: center;
}

:deep(.p-tabmenu-nav) {
    justify-content: center; /* Ensures the nav container itself centers items */
}
</style>