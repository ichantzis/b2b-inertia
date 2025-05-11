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
    /* padding-top: 1.5rem; */
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

.category-section {
    /* Optional: add padding if content-wrapper has no horizontal padding */
    /* padding-left: 1rem; */
    /* padding-right: 1rem; */
}

.category-title {
    padding-left: 1rem;
    /* Ensure title aligns with content */
    padding-right: 1rem;
    text-decoration: none;
    /* Explicitly remove underline from the Link component itself */
    color: inherit;
}

.horizontal-scroll-wrapper {
    overflow-x: auto;
    /* For a cleaner scrollbar look (might need browser prefixes or ::-webkit-scrollbar) */
    -webkit-overflow-scrolling: touch;
    /* Smooth scrolling on iOS */
    scrollbar-width: thin;
    /* For Firefox */
    scrollbar-color: #cbd5e1 #f1f5f9;
    /* thumb and track color for Firefox */
    padding-left: 1rem;
    /* Ensure first item has padding from edge */
    padding-right: 1rem;
    /* Ensure last item has padding before content cuts off */
}

/* Hide scrollbar visually but keep functionality */
.horizontal-scroll-wrapper::-webkit-scrollbar {
    height: 8px;
    /* Adjust height of the scrollbar */
}

.horizontal-scroll-wrapper::-webkit-scrollbar-track {
    background: #f1f5f9;
    /* Light track */
    border-radius: 4px;
}

.horizontal-scroll-wrapper::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    /* Color of the scroll thumb */
    border-radius: 4px;
    /* border: 2px solid #f1f5f9;  Optional: creates padding around thumb */
}

.horizontal-scroll-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
    /* Darker on hover */
}


.collections-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    /* Crucial for horizontal scrolling */
    gap: 2rem;
    /* Space between collection items */
    padding-bottom: 1rem;
    /* Space for scrollbar or just visual */
}

.collection-item-wrapper {
    flex: 0 0 auto;
    /* Prevent items from shrinking or growing */
    /* To show ~3.5 items on smaller screens:
      If screen width is ~320px (smallest common mobile), 320px / 3.5 = ~91px. This is too small for a card.
      Let's aim for a minimum card width and let the "half card" be natural due to overflow.
      A common small card width could be around 140px to 160px.
      If we set width to calc((100% / 3) - 1rem) /* for 3 items with gap 
      Or better, set a fixed min-width and a percentage based width for larger views.
    */
    width: calc((100vw - 2rem - 2rem - (2 * 1rem)) / 3.5);
    /* (viewport - wrapper_padding - row_gap) / num_items */
    max-width: 180px;
    /* Max width for a single card in the row */
    min-width: 140px;
    /* Min width to ensure readability */
}


.collection-card {
    width: 100%;
    height: 100%;
    /* Make card fill the wrapper */
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    border-radius: 8px;
    overflow: hidden;
    /* border: 1px solid #e5e7eb; */
    box-shadow: none;
}

.collection-card:hover {
    /* transform: translateY(-4px); */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;

}

.collection-image-wrapper {
    aspect-ratio: 1 / 1;
    /* Square images */
    width: 100%;
    background-color: #f0f0f0;
    overflow: hidden;
}

.collection-image {
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.collection-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 0.8rem;
}

.collection-name-heading {
    /* text-md font-semibold text-center block mt-3 mb-1 are from Tailwind via class attribute */
    color: #1f2937;
    /* Darker gray, adjust as needed */
    line-height: 1.4;
    /* Adjust line height for better readability */
    /* Ensure it can wrap if needed, but also truncate for consistency */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.5em;
    /* Adjust based on font-size and line-height to prevent jumpiness */
    /* The px-2 class adds horizontal padding to the heading text */
}

.collection-link-wrapper {
    display: block;
    /* Already applied via class attribute */
    text-decoration: none;
    /* Explicitly remove underline from the Link component itself */
    color: inherit;
    /* Make the link inherit text color from its parent */
}

.collection-link-wrapper:hover {
    text-decoration: none;
    /* Ensure no underline on hover either */
}

/* PrimeVue Card specific overrides if needed */
:deep(.p-card-body) {
    padding: 0rem;
    flex-grow: 1;
    /* Allow body to grow to fill height */
    display: flex;
    flex-direction: column;
}

:deep(.p-card-content) {
    padding: 0.5rem 0.75rem;
    flex-grow: 1;
    /* Allow content (description, artwork count) to push title up if card fixed height */
}

:deep(.p-card-title) {
    padding: 0 0.75rem;
}

/* Responsive adjustments for card widths in the horizontal row */
@media (min-width: 480px) {

    /* Slightly larger small screens */
    .collection-item-wrapper {
        width: calc((100vw - 2rem - 2rem - (3 * 1rem)) / 4.5);
        /* Aim for ~4.5 items */
        max-width: 200px;
        min-width: 150px;
    }
}

@media (min-width: 768px) {

    /* md screens */
    .collection-item-wrapper {
        /* Show more items or let them be larger */
        width: calc((768px - 2rem - 2rem - (4 * 1rem)) / 5);
        /* Example: show 5 if container is full width */
        max-width: 220px;
        min-width: 160px;
    }

    .content-wrapper {
        /* padding: 2rem 1rem; */
        /* Restore some horizontal padding for larger screens */
    }
}

@media (min-width: 1024px) {

    /* lg screens */
    .collection-item-wrapper {
        width: auto;
        /* Let items take natural width based on content or a larger fixed min-width */
        min-width: 180px;
        /* Adjust as desired */
        max-width: 240px;
    }

    /* On larger screens, you might not need the aggressive horizontal scroll if items fit.
       The overflow-x: auto will handle it.
    */
}
</style>