<template>
    <div class="artwork-details">
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-else-if="artwork" class="artwork-container">
            <div class="artwork-image">
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5"
                    :thumbnailsPosition="position" :circular="true" :showThumbnailNavigators="true"
                    :showThumbnails="true" containerClass="custom-galleria" container-style="max-width: 640px;">
                    <template #item="slotProps">
                        <div class="galleria-item">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                                class="galleria-main-image" />
                            <span class="galleria-title">{{ slotProps.item.title }}</span>
                        </div>
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                            class="galleria-thumbnail" />
                    </template>
                </Galleria>
            </div>
            <div class="artwork-info">
                <h1 class="artwork-title">{{ artwork.title?.en || 'Untitled' }}</h1>
                <div class="artist-info">
                    <h2>{{ artwork.artist }}</h2>
                    <p class="artwork-type">{{ artwork.artwork_type }}</p>
                </div>
                <div class="metadata">
                    <div class="metadata-item">
                        <span class="label">ID:</span>
                        <span>{{ artwork.id }}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Category:</span>
                        <span>{{ artwork.category }}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Keywords:</span>
                        <div class="tags-wrapper">
                            <Tag v-for="keyword in keywords" :key="keyword" :value="keyword.toLowerCase()"
                                severity="secondary" rounded />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <ProgressSpinner />
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import Galleria from 'primevue/galleria';
import Tag from 'primevue/tag';

const props = defineProps({
    artwork: {
        type: Object,
        default: null
    },
    error: {
        type: String,
        default: null
    }
});

const artwork = ref(Array.isArray(props.artwork) ? props.artwork[0] : props.artwork);

const keywords = computed(() => {
    if (!artwork.value?.keywords?.en) return [];
    return artwork.value.keywords.en.split(',').map(keyword => keyword.trim());
});

const position = ref('bottom');

const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 2
    }
]);

const images = computed(() => {
    if (!artwork.value.urls) return [];

    const allImages = [];

    // Add main high-res image
    if (artwork.value.urls.img_high) {
        allImages.push({
            itemImageSrc: artwork.value.urls.img_high,
            thumbnailImageSrc: artwork.value.urls.img_thumb,
            alt: artwork.value.title?.en || 'Artwork main view',
            title: 'Original Artwork'
        });
    }
    console.log(allImages);


    // Add interior views if available
    if (artwork.value.urls.interiors && typeof artwork.value.urls.interiors === 'object') {
        Object.values(artwork.value.urls.interiors).forEach((interior) => {
            allImages.push({
                itemImageSrc: interior.url,
                thumbnailImageSrc: interior.url,
                alt: interior['short-name'],
                title: interior['short-name']
                    .replace('pictufy-', '')
                    .replace(/-/g, ' ')
                    .replace(/ratio.*$/, '')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            });
        });
    }

    return allImages;
});
</script>

<style scoped>
.artwork-details {
    /* max-width: 1600px; */
    margin: 0 auto;
    padding: 2rem;
}

.artwork-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* gap: 2rem; */
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    min-height: 90vh;
}

.artwork-image {
    position: relative;
    padding: 2rem;
}

.main-image {
    width: 100%;
    height: auto;
    max-height: 70vh;
    object-fit: contain;
    padding: 3rem;
}

.artwork-info {
    padding: 5rem;
    /* border-left: 1px solid #eee; */
}

.artwork-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.artist-info {
    margin-bottom: 2rem;
}

.artwork-type {
    color: #666;
    font-size: 0.875rem;
    text-transform: capitalize;
}

.metadata {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.metadata-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: large;
}

.label {
    font-weight: 500;
    color: #666;
}

.error-message {
    text-align: center;
    color: #ef4444;
    padding: 2rem;
    font-size: 1.25rem;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

@media (max-width: 1024px) {
    .artwork-container {
        grid-template-columns: 1fr;
    }

    .artwork-info {
        border-left: none;
        border-top: 1px solid #eee;
    }
}

@media (max-width: 640px) {
    .artwork-details {
        padding: 1rem;
    }

    .artwork-image,
    .artwork-info {
        padding: 1rem;
    }

    .artwork-title {
        font-size: 1.5rem;
    }
}

.galleria-main-image {
    width: 100%;
    height: auto;
    max-height: 50vh;
    object-fit: contain;
}

.galleria-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    max-height: 75px;
    min-width: 100px;
}

:deep(.custom-galleria) {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

:deep(.p-galleria-thumbnail-container) {
    padding: 1rem 0;
}

:deep(.p-galleria-thumbnail-item) {
    opacity: 0.6;
    transition: opacity 0.3s;
}

:deep(.p-galleria-thumbnail-item.p-galleria-thumbnail-item-current) {
    opacity: 1;
}

:deep(.p-galleria-thumbnail-item:hover) {
    opacity: 0.8;
}

.galleria-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.galleria-title {
    color: #666;
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
}


.keywords-container {
    flex-direction: column;
    align-items: flex-start;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

:deep(.p-tag) {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: #f3f4f6;
    color: #4b5563;
    border: none;
}

:deep(.p-tag:hover) {
    background: #e5e7eb;
}
</style>