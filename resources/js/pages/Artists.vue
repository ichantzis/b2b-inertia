<script setup>
import { Link, Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout });

const props = defineProps({
    artists: {
        type: Array,
        default: () => []
    },
    currentOrder: {
        type: String,
        default: 'trending'
    }
});

const decodeHTMLEntities = (text) => {
    if (typeof text !== 'string') return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

// Map sorting options for potential future dropdown implementation
const sortOptions = [
    { label: 'Trending', value: 'trending' },
    { label: 'Name (A-Z)', value: 'alpha' },
    { label: 'Artwork Count', value: 'artwork_count' },
];
</script>

<template>
    <InertiaHead title="Artists" />
    
    <div class="page-container">
        <div class="main-content-area">
            <div class="content-wrapper">
                <div class="flex justify-between items-center mb-10">
                    <h1 class="text-3xl font-bold text-gray-800">Featured Artists</h1>
                    </div>

                <div v-if="artists.length > 0" class="artists-grid">
                    <div v-for="artist in artists" :key="artist.artist_id" class="artist-item">
                        <Link :href="route('artist.show', { artist_id: artist.artist_id })" class="block link-wrapper">
                            <Card class="artist-card p-0">
                                <template #header>
                                    <div class="image-wrapper">
                                        <img 
                                            v-if="artist.profile_picture" 
                                            :src="artist.profile_picture" 
                                            :alt="artist.name" 
                                            class="artist-image" 
                                            loading="lazy" 
                                        />
                                        <div v-else class="image-placeholder">
                                            <i class="pi pi-user text-4xl"></i>
                                        </div>
                                    </div>
                                </template>
                                <template #title>
                                    <h3 class="name-heading text-md font-semibold text-center mt-3 mb-1 px-2">
                                        {{ decodeHTMLEntities(artist.name) }}
                                    </h3>
                                </template>
                                <template #subtitle>
                                    <div class="text-center text-sm text-gray-500 px-2">
                                        {{ artist.artist_type }}
                                    </div>
                                </template>
                                <template #content>
                                    <div class="text-center pb-3 mt-2">
                                        <span class="text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
                                            {{ artist.artworks }} Artworks
                                        </span>
                                    </div>
                                </template>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div v-else class="text-center py-20">
                    <p class="text-xl text-gray-500">No artists found.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8f9fa;
}

.main-content-area {
    flex-grow: 1;
    padding: 2rem;
    width: 100%;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1400px; /* Constrain max width for large screens */
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

.artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.link-wrapper {
    text-decoration: none;
    color: inherit;
    height: 100%;
}

.artist-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid transparent;
}

.artist-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb;
}

.image-wrapper {
    aspect-ratio: 1 / 1;
    width: 100%;
    background-color: #f0f0f0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
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
    background-color: #e5e7eb;
}

.name-heading {
    color: #1f2937;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>