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
        <CollectionSidebar class="hide" />
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
                                         class="collection-image-vue transition-transform duration-500 ease-in-out"
                                         loading="lazy" />
                                    <div v-else class="collection-image-placeholder-vue">
                                        <span>No Image</span>
                                    </div>
                                </div>
                            </Link>
                        </template>
                        <template #title>
                           <Link :href="route('collection.show', { collection_slug: collection.slug })"
                                  class="collection-name-link-vue text-lg font-semibold text-gray-700 hover:text-primary-600 text-center block mt-4 no-underline px-2">
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
/* Main layout structure for pages using the sidebar */
.page-with-sidebar-layout {
    display: flex;
    /* Let HeaderLayout manage overall page background and min-height */
}

.main-content-area {
    flex-grow: 1;
    /* Padding left to make space for the fixed sidebar */
    padding-left: 300px; /* Sidebar width (e.g., 280px) + some margin (e.g., 20px) */
    transition: padding-left 0.3s ease-in-out;
    padding-top: 2rem; 
    padding-right: 2rem;
    padding-bottom: 2rem;
    width: 100%; /* Ensure it tries to take available width */
    box-sizing: border-box; /* Include padding in width calculation */
    overflow-x: hidden; /* Prevent this area from causing horizontal scroll */
}

@media (max-width: 1199.98px) {
    .main-content-area {
        padding-left: 2rem; /* Adjust to your desired padding when sidebar is hidden */
        /* Or padding-left: 0; if you want content to go full width */
    }
    .hide {
        display: none; /* Hide sidebar on smaller screens */
    }
}

.content-wrapper { /* This was .content-wrapper-vue in a previous suggestion, ensure consistency */
    margin: 0 auto;
    max-width: 100%; /* Takes full width of .main-content-area */
    background: white;
    border-radius: 12px;
    padding: clamp(1rem, 5vw, 2rem); /* Responsive padding */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

/* Grid for collections within this specific category page */
.collections-grid-vue {
    display: grid;
    gap: 1.5rem; /* Consistent gap */
    /* Ensure at least 2 columns on small screens, then adapt */
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Smaller min for more items */
}

/* Media queries for explicit column counts if auto-fill isn't enough */
@media (max-width: 599.98px) { /* Screens smaller than 600px */
    .collections-grid-vue {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Even smaller min for 2 columns */
        /* Or, to force 2 columns if items are very flexible: */
        /* grid-template-columns: repeat(2, 1fr); */
        gap: 1rem; /* Reduce gap on smallest screens */
    }
     .content-wrapper {
        padding: clamp(1rem, 5vw, 1.5rem);
    }
    .main-content-area { /* Adjust padding for very small screens */
        padding-left: 1rem;
        padding-right: 1rem;
    }
     @media (max-width: 1199.98px) { /* When sidebar is hidden */
        .main-content-area {
            padding-left: 1rem;
        }
    }
}


.collection-card-vue {
    border-radius: 10px; 
    background-color: #fff;
    display: flex; /* Added for flex context within card */
    flex-direction: column; /* Ensure content stacks vertically */
    height: 100%; /* Make cards in a row equal height if grid implies it */
}
.collection-card-vue:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.collection-image-wrapper-vue {
    aspect-ratio: 1 / 1; 
    width: 100%;
    background-color: #e9ecef; 
    border-top-left-radius: 10px; 
    border-top-right-radius: 10px;
    overflow: hidden; /* Ensure image scaling doesn't break radius */
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.collection-image-vue {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Changed from fill, cover is usually better */
    object-position: top center;
}

.collection-image-placeholder-vue {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #adb5bd; 
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
    /* min-height: 2.8em;  */
    line-height: 1.4em; 
    color: #1f2937; /* Default text color */
    padding: 0 0.5rem; /* Add some horizontal padding */
}
.collection-name-link-vue:hover {
    color: var(--p-primary-color, #3B82F6);
}
.no-underline {
    text-decoration: none !important;
}

/* Ensure PrimeVue Card's internal body allows flex to work for card height */
:deep(.p-card-body) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0; /* Reset if you control padding via slots */
}
:deep(.p-card-content) {
    flex-grow: 1; /* Allows content to push footer down if card heights are equal */
    padding-top: 0.5rem; /* Adjust as needed */
}
:deep(.p-card-title) {
    padding-top: 0.75rem; /* PrimeVue specific slot padding for title */
    padding-bottom: 0.25rem;
}
</style>