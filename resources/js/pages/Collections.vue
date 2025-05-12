<script setup>
import { computed } from 'vue';
import { Link, Head as InertiaHead, usePage } from '@inertiajs/vue3';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import CollectionSidebar from '@/components/CollectionSidebar.vue';
import { slugify } from '@/composables/utils.js';

defineOptions({ layout: HeaderLayout });

const props = defineProps({
    // Assuming you are passing categorized collections from the controller
    // This is needed for the "collections in every category" requirement
    categorized_collections: {
        type: Array,
        default: () => []
    },
    // Fallback if you were to use a flat list (though the request implies categories)
    collections: {
        type: Array,
        default: () => []
    }
});

const page = usePage();

// The sidebar will use page.props.allCollectionCategoriesWithCollections globally
// This page's main content might display featured collections, or the same categorized view.
// For this example, let's assume this page will show categories with horizontally scrollable collections.
const categorizedCollectionsForMainView = computed(() => page.props.allCollectionCategoriesWithCollections || []);


const decodeHTMLEntities = (text) => {
    if (typeof text !== 'string') return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

// This computed property is for categorized_collections
const decodedCategorizedCollections = computed(() => {
    if (!props.categorized_collections || props.categorized_collections.length === 0) {
        // Handle the case where you might be using the flat 'collections' prop
        // and group them here if necessary, or ensure controller sends categorized data.
        // For this example, we assume categorized_collections is what we're working with.
        if (props.collections.length > 0) {
            // Simple fallback: treat all flat collections as one "General" category
            return [{
                category_id: 'all',
                category_name: 'All Collections',
                collections: props.collections.map(collection => ({
                    ...collection,
                    name: decodeHTMLEntities(collection.name),
                    description: decodeHTMLEntities(collection.description),
                }))
            }];
        }
        return [];
    }
    return props.categorized_collections.map(category => ({
        ...category,
        category_name: decodeHTMLEntities(category.category_name),
        collections: category.collections.map(collection => ({
            ...collection,
            name: decodeHTMLEntities(collection.name),
            description: decodeHTMLEntities(collection.description),
            // slug is assumed to be prepared in controller
        }))
    }));
});

</script>

<template>
    <InertiaHead title="Collections" />
    <div class="page-with-sidebar-layout">
        <CollectionSidebar />
        <div class="main-content-area">
            <div class="content-wrapper">
                <h1 class="text-3xl font-bold mb-10 text-center">Collections</h1>
                <div v-if="decodedCategorizedCollections.length > 0">
                    <section v-for="category in decodedCategorizedCollections"
                        :key="category.category_id || category.category_name" class="category-section mb-12">
                        <Link class="category-title text-2xl font-semibold mb-5 text-left"
                            :href="route('collections.category.show', { category_collection_slug: slugify(category.category_name) })">
                        {{ category.category_name }}
                        <Divider />
                        </Link>
                        <div class="horizontal-scroll-wrapper">
                            <div class="collections-row">
                                <div v-for="collection in category.collections" :key="collection.id"
                                    class="collection-item-wrapper">
                                    <Link :href="route('collection.show', { collection_slug: collection.slug })"
                                        class="block collection-link-wrapper">
                                    <Card class="collection-card p-0">
                                        <template #header>

                                            <div class="collection-image-wrapper">
                                                <img v-if="collection.thumb" :src="collection.thumb"
                                                    :alt="collection.name" class="collection-image" loading="lazy" />
                                                <div v-else class="collection-image-placeholder">No Image</div>
                                            </div>
                                        </template>
                                        <template #title>
                                            <h3
                                                class="collection-name-heading text-md font-semibold text-center block mt-3 mb-1 px-2">
                                                {{ collection.name }}
                                            </h3>
                                        </template>
                                        <template #content>
                                            <div class="text-center pb-3">
                                                <p class="text-xs text-surface-600">
                                                    {{ collection.artworks_count }} artworks
                                                </p>
                                            </div>
                                        </template>
                                    </Card>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="text-center py-10">
                    <p class="text-xl text-surface-700">No collections found at the moment.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-with-sidebar-layout {
    display: flex;
    /* background: white; */ /* Moved background to content-wrapper if needed */
    /* Removed padding, border-radius, box-shadow from here, should be on content-wrapper */
}

.main-content-area {
    flex-grow: 1;
    padding-left: 300px; /* Width of the sidebar */
    transition: padding-left 0.3s ease-in-out;
    min-height: calc(100vh - 120px); /* Adjust 120px if your header height is different */
    /* padding-top: 1.5rem;  */
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
    /* background-color: #f8f9fa;  */
    overflow-y: auto; /* Allow vertical scroll for the content area itself */
}

@media (max-width: 1199.98px) {
    .main-content-area {
        padding-left: 0; /* Sidebar is hidden, content takes full width */
    }
}

.content-wrapper { /* Reverted to content-wrapper, ensure styles are what you want */
    margin: 0 auto;
    max-width: 100%; 
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}

.category-section {
    /* padding-left: 1rem; */ /* Optional, if .content-wrapper doesn't have side padding */
    /* padding-right: 1rem; */
}

.category-title {
    display: block; /* Make the link block for better click area */
    padding-left: 0; /* Adjusted as divider is now below */
    padding-right: 0;
    text-decoration: none;
    color: #374151; /* text-gray-700 */
    margin-bottom: 0.5rem; /* Space before divider */
}
.category-title:hover {
    color: var(--p-primary-color, #3B82F6);
}

/* --- This section is key for per-category horizontal scroll --- */
.horizontal-scroll-wrapper {
    overflow-x: auto; /* Enable horizontal scroll on this wrapper */
    overflow-y: hidden; /* Prevent vertical scrollbars on this element */
    white-space: nowrap; /* Prevent items in .collections-row from wrapping (alternative to flex-wrap: nowrap) - though flex is better */
    padding: 0.5rem 0 1rem 0.25rem; /* Padding for aesthetics, esp. for scrollbar and first/last item visibility */
    /* For a cleaner scrollbar look */
    -webkit-overflow-scrolling: touch; 
    scrollbar-width: thin; 
    scrollbar-color: #cbd5e1 #f1f5f9; 
}

.horizontal-scroll-wrapper::-webkit-scrollbar {
    height: 8px; 
}
.horizontal-scroll-wrapper::-webkit-scrollbar-track {
    background: #f8f9fa; /* Match page background */
    border-radius: 4px;
}
.horizontal-scroll-wrapper::-webkit-scrollbar-thumb {
    background-color: #bdc1c6; /* Softer scrollbar thumb */
    border-radius: 4px;
}
.horizontal-scroll-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

.collections-row {
    display: inline-flex; /* Changed from flex to inline-flex. Or keep flex and ensure wrapper has width context */
    flex-direction: row;
    /* flex-wrap: nowrap; /* Redundant if using white-space: nowrap on parent, but good for clarity with flex */
    gap: 1.5rem; 
    /* padding-bottom: 1rem; Removed, handled by wrapper */
    /* min-width: min-content; /* Allow row to be as wide as its content */
}

.collection-item-wrapper {
    flex: 0 0 auto; /* Prevent items from shrinking or growing */
    
    /* MODIFIED: Set a fixed or percentage width that makes sense for the card content */
    /* This ensures at least 2 items are shown on smaller screens for the HORIZONTAL SCROLL */
    /* If you want to show ~2.5 items before scrolling starts on a typical mobile (e.g. 375px wide)
       375px / 2.5 = 150px. Let's use a base width and allow more on wider horizontal scroll areas.
    */
    width: 160px; /* Example fixed width */
    /* Or for responsive width within the scroll, if desired: */
    /* width: clamp(150px, 40vw, 220px); */ /* Adjust clamp values */
    
    /* To guarantee at least 2 full items visually on small viewports before scrolling becomes very apparent */
    /* this implies the viewport itself would need to be around 2*width + gap. */
    /* The "at least 2 collections per row" might be better applied to a grid, not a horizontal scroll. */
    /* For horizontal scroll, this just sets individual item width. */
}
/* --- End of key horizontal scroll section --- */


.collection-card { /* Renamed to match user's provided template */
    width: 100%;
    height: 100%; 
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Softer default shadow */
    border: 1px solid transparent; /* for smooth hover transition */
}

.collection-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: #e5e7eb; 
}

.collection-image-wrapper { /* Renamed to match user's template */
    aspect-ratio: 1 / 1; /* Kept square as per user's template */
    width: 100%;
    background-color: #f0f0f0;
    overflow: hidden;
}

.collection-image { /* Renamed */
    width: 100%;
    height: 100%;
    object-fit: cover; /* Changed from fill to cover as it's usually better */
    object-position: top center;

}

.collection-image-placeholder { /* Renamed */
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 0.8rem;
}

.collection-name-heading { /* Renamed */
    color: #1f2937;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* min-height: 2.5em;  */
    padding: 0 0.5rem; /* Added padding here instead of directly on text for centering */
}

.collection-link-wrapper { /* From user template */
    display: block;
    text-decoration: none;
    color: inherit;
}
.collection-link-wrapper:hover {
    text-decoration: none;
}

:deep(.p-card-body) {
    padding: 0rem; 
    flex-grow: 1; 
    display: flex;
    flex-direction: column;
}
:deep(.p-card-content) { /* Controls padding around "X artworks" text */
    padding: 0.25rem 0.75rem 0.75rem; /* Reduced top padding */
    flex-grow: 1; 
}
:deep(.p-card-title) { /* Controls padding around h3 title */
    padding: 0; /* Removed direct padding here, handle on h3 itself */
}

/* Media queries for collection-item-wrapper if using fixed widths for different screen classes */
/* Not strictly needed if using a single fixed width like 160px for horizontal scroll items,
   as the number of visible items will naturally adjust. */

</style>