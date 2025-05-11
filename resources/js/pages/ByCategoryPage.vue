<script setup>
import { computed } from 'vue';
import { Link, Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import HeaderLayout from '@/layouts/HeaderLayout.vue'; // Assuming this is your main layout
import CollectionSidebar from '@/components/CollectionSidebar.vue';


defineOptions({ layout: HeaderLayout });

const props = defineProps({
    categoryName: {
        type: String,
        required: true,
        default: 'Category'
    },
    collections: { // Array of collection objects passed from the controller
        type: Array,
        required: true,
        default: () => []
    },
    categoryId: { // The ID of the current category, might be useful
        type: String,
        // required: true // Make optional if not always strictly needed for display
    }
});

// The controller already decodes HTML entities, so this might not be strictly needed here
// unless there's a double encoding or names weren't decoded.
const decodeHTMLEntities = (text) => {
    if (typeof text !== 'string' || !text) return '';
    // Avoid creating DOM elements if not in a browser environment (e.g., SSR might complain)
    if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
    return text; // Fallback for non-browser environments
};

const processedCollections = computed(() => {
    return props.collections.map(collection => ({
        ...collection,
        // name: decodeHTMLEntities(collection.name) // Uncomment if names still need decoding client-side
    }));
});

</script>

<template>
    <InertiaHead :title="props.categoryName" />
    <div class="page-with-sidebar-layout">
        <CollectionSidebar />
        <div class="main-content-area">
            <div class="content-wrapper">
                <h1 class="text-3xl lg:text-4xl font-bold mb-8 text-center text-gray-800">{{ props.categoryName }}</h1>                
                <div v-if="processedCollections.length > 0" class="collections-grid-vue">
                    <Card v-for="collection in processedCollections" 
                          :key="collection.id" 
                          class="collection-card-vue p-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                        <template #header>
                            <Link :href="route('collection.show', { collection_slug: collection.slug })"
                                  class="block group">
                                <div class="collection-image-wrapper-vue overflow-hidden">
                                    <img v-if="collection.thumb" 
                                         :src="collection.thumb" 
                                         :alt="collection.name"
                                         class="collection-image-vue group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                         loading="lazy" />
                                    <div v-else class="collection-image-placeholder-vue">
                                        <span>No Image</span>
                                    </div>
                                </div>
                            </Link>
                        </template>
                        <template #title>
                           <Link :href="route('collection.show', { collection_slug: collection.slug })"
                                  class="collection-name-link-vue text-lg font-semibold text-gray-700 hover:text-primary-600 text-center block mt-4 mb-2 no-underline px-2">
                                {{ collection.name }}
                            </Link>
                        </template>
                        <template #content>
                            <div class="text-center pb-4 px-2">
                                <p class="text-sm text-gray-500 no-underline">
                                    {{ collection.artworks_count }} artworks
                                </p>
                            </div>
                        </template>
                    </Card>
                </div>
                <div v-else class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">No Collections Found</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        There are currently no collections available in the category "{{ props.categoryName }}".
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Added -vue suffix to avoid style conflicts if you have global styles with same names */
.page-with-sidebar-layout {
    display: flex;
    padding-top: 0;
    /* Assuming header is fixed and provides its own padding/margin for content below it */
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

.main-content-area {
    flex-grow: 1;
    padding-left: 280px;
    /* Width of the sidebar */
    transition: padding-left 0.3s ease-in-out;
    /* background-color: #f4f7f6; */
    min-height: calc(100vh - 120px);
    /* Adjust 120px if your header height is different */
    padding-top: 1.5rem;
    /* Padding for content inside */
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
}

@media (max-width: 1199.98px) {
    .main-content-area {
        padding-left: 0;
        /* Sidebar is hidden, content takes full width */
    }
}

.content-wrapper {
    margin: 0 auto;
    max-width: 100%;
    /* Allow it to fill the main-content-area */
    /* background: white;
    border-radius: 12px; */
    /* padding: 2rem; */
    /* box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07); */
}


@media (min-width: 768px) {
    .main-content {
        padding: 2rem;
    }
}

@media (min-width: 768px) {
    .content-wrapper {
        padding: 2.5rem;
    }
}

.collections-grid-vue {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Responsive grid */
    gap: 2rem;
}

.collection-card-vue {
    border-radius: 10px; /* Consistent radius */
    background-color: #fff;
    /* PrimeVue card might have its own padding, p-0 removes it from the component itself */
}

.collection-image-wrapper-vue {
    aspect-ratio: 4 / 3; /* More common aspect ratio for collection covers */
    width: 100%;
    background-color: #e9ecef; /* Lighter placeholder */
    border-top-left-radius: 10px; /* Match card radius */
    border-top-right-radius: 10px;
}

.collection-image-vue {
    width: 100%;
    height: 100%;
    object-fit: fill;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.collection-image-placeholder-vue {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #adb5bd; /* Softer placeholder text color */
    font-size: 0.9rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.collection-name-link-vue {
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.8em; /* Adjusted for text-lg and line-height */
    line-height: 1.4em; 
    /* color defined by Tailwind classes */
}
.no-underline {
    text-decoration: none !important;
}
</style>