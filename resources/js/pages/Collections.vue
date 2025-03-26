<script setup>
import { ref, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import Card from 'primevue/card';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout});

const props = defineProps({
    lists: {
        type: Array,
        required: true
    }
});

const decodedLists = computed(() => {
    return props.lists.map(list => ({
        ...list,
        name: decodeHTMLEntities(list.name)
    }));
});

// Helper function to decode HTML entities
const decodeHTMLEntities = (text) => {
    if (!text) return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};
</script>

<template>
    <InertiaHead title="Collections" />
    <div class="layout-container">
        <div class="main-content">
            <div class="content-wrapper">
                <h1 class="text-3xl font-bold mb-8 text-center">Collections</h1>
                
                <div class="collections-grid">
                    <Card v-for="list in decodedLists" 
                          :key="list.list_id" 
                          class="collection-card p-0"
                    >
                        <template #header>
                            <Link 
                                :href="route('collection.filtered', { list_id: list.list_id })"
                                class="text-lg font-semibold hover:text-primary-500 text-center block"
                            >
                            <div class="collection-image-wrapper">
                                <img :src="list.cover" 
                                     :alt="list.name"
                                     class="collection-image"
                                />
                            </div>
                        </Link>
                        </template>
                        <template #title>
                            <h3 class="text-center">{{ list.name }}</h3>                            
                        </template>
                        <!-- <template #content>
                            <div class="text-center">
                                <p class="text-sm text-surface-600">
                                    {{ list.artwork_count }} artworks
                                </p>
                            </div>
                        </template> -->
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    padding: 2rem;
}

.collections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    justify-items: center;
}

@media (min-width: 1024px) {
    .collections-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.collection-card {
    width: 100%;
    max-width: 400px;
    transition: transform 0.2s, box-shadow 0.2s;
    border-radius: 8px;
    box-shadow: none;  /* Remove default shadow */
}

.collection-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);  /* Add shadow only on hover */
}

.collection-image-wrapper {
    aspect-ratio: 1;
    width: 100%;
    overflow: hidden;
}

.collection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}
</style>