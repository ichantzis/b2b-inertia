<script setup>
import { computed } from 'vue';
import { Link, Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

defineOptions({ layout: HeaderLayout });

const props = defineProps({
    artists: {
        type: Array,
        default: () => []
    },
});

const decodeHTMLEntities = (text) => {
    if (typeof text !== 'string') return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

// Group artists by first letter
const groupedArtists = computed(() => {
    const groups = {};
    const sortedArtists = [...props.artists].sort((a, b) => 
        a.name.localeCompare(b.name)
    );

    sortedArtists.forEach(artist => {
        let letter = artist.name.charAt(0).toUpperCase();
        // Group non-letters (numbers/symbols) under '#'
        if (!/[A-Z]/.test(letter)) {
            letter = '#';
        }
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(artist);
    });

    // Sort keys: Letters first, then '#' at the end
    const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (a === '#') return 1; 
        if (b === '#') return -1;
        return a.localeCompare(b);
    });

    return sortedKeys.reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
    }, {});
});

// Generate Alphabet Array for the sidebar (A-Z, then #)
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#'];

const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
        // Offset for sticky headers 
        const yOffset = -140; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};
</script>

<template>
    <InertiaHead title="All Artists" />
    
    <div class="page-container">
        <div class="main-content-area">
            <div class="content-wrapper">
                <h1 class="text-3xl font-bold text-center">All Artists</h1>
                <div class="flex flex-col sm:flex-row items-center justify-between mb-10">                    
                    <div class="flex items-center gap-4 mt-4 sm:mt-0">
                        <Link :href="route('artists.overview')">
                            <Button label="Back to Overview" icon="pi pi-arrow-left" text />
                        </Link>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 relative">
                    
                    <div class="hidden lg:block w-16 flex-shrink-0">
                        <div class="sticky top-24 flex flex-col gap-2 items-center bg-gray-50 py-4 rounded-full shadow-inner max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div 
                                v-for="letter in alphabet" 
                                :key="letter"
                                @click="scrollToLetter(letter)"
                                class="transition-all duration-200"
                            >
                                <Avatar 
                                    :label="letter" 
                                    shape="circle"
                                    class="cursor-pointer font-bold transition-colors duration-200"
                                    :class="[
                                        groupedArtists[letter] 
                                            ? 'bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900' 
                                            : 'bg-transparent text-gray-200 cursor-not-allowed'
                                    ]"
                                    :style="groupedArtists[letter] ? {} : { pointerEvents: 'none' }"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex-grow">
                        <div class="lg:hidden sticky top-24 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex overflow-x-auto gap-2 mb-8 py-3 custom-scrollbar">
                            <div 
                                v-for="letter in alphabet" 
                                :key="letter"
                                @click="scrollToLetter(letter)"
                                class="flex-shrink-0"
                            >
                                <Avatar 
                                    :label="letter" 
                                    shape="circle"
                                    class="cursor-pointer font-bold border border-gray-100"
                                    :class="[
                                        groupedArtists[letter] 
                                            ? 'bg-white text-gray-700 hover:bg-gray-100' 
                                            : 'bg-gray-50 text-gray-300'
                                    ]"
                                />
                            </div>
                        </div>

                        <div v-if="Object.keys(groupedArtists).length > 0">
                            <div v-for="(group, letter) in groupedArtists" :key="letter" :id="`letter-${letter}`" class="mb-12">
                                <div class="flex items-end mb-6 border-b border-gray-200 pb-2">
                                    <h2 class="text-xl font-bold text-gray-800">{{ letter }}</h2>
                                    <span class="text-sm text-gray-400 ml-3 mb-1">({{ group.length }})</span>
                                </div>

                                <div class="artists-grid">
                                    <div v-for="artist in group" :key="artist.artist_id">
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
                                                            {{ artist.artwork_count }} Artworks
                                                        </div>
                                                    </div>
                                                </template>
                                            </Card>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-else class="text-center py-20 text-gray-500">
                            No artists found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    max-width: 100%;
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 0px; 
    background: transparent;
}
.lg\:hidden.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}
.lg\:hidden.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
}

/* Reusing Card Styling */
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

/* RESPONSIVE GRID CONFIGURATION */
.artists-grid {
    display: grid;
    /* Force 2 columns on small screens */
    grid-template-columns: repeat(2, 1fr); 
    gap: 1rem;
}

@media (min-width: 640px) {
    .artists-grid {
        /* Revert to flexible columns on larger screens */
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
    }
}

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