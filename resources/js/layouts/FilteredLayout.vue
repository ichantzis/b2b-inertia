<template>
    <HeaderLayout> <div class="layout-wrapper">
            <Transition name="slide">
                <div v-show="showFilters" class="sidebar-container">
                    <Button
                        icon="pi pi-times"
                        @click="toggleFilters"
                        class="close-button lg:hidden"
                        severity="secondary"
                        text
                        rounded
                    />
                    <FilterSidebar
                        :list-id="$page.props.collectionId"
                        :collection-slug="$page.props.collectionSlug"
                        :active-filters="$page.props.filters || []"
                        :current-search-query="currentPageSearchTerm"
                        class="floating-sidebar"
                    />
                </div>
            </Transition>

            <main :class="['main-content', { 'with-sidebar': showFilters }]">
                <slot></slot> </main>

            <div v-if="showFilters"
                 class="sidebar-overlay lg:hidden"
                 @click="toggleFilters">
            </div>
        </div>
    </HeaderLayout>
</template>

<script setup>
import { ref, provide, computed } from 'vue';
import { usePage } from '@inertiajs/vue3'; // Import usePage
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import FilterSidebar from '@/components/FilterSidebar.vue';
// import { Head } from '@inertiajs/vue3'; // Head is usually for page components, not layouts directly setting document head title.

const page = usePage(); // Initialize usePage
const showFilters = ref(false);

function toggleFilters() {
    showFilters.value = !showFilters.value;
}

// This will be the search term active for the current page, passed from the controller via page props
const currentPageSearchTerm = computed(() => page.props.currentSearchTerm || '');

provide('layout', {
    toggleFilters,
    isFiltersVisible: computed(() => showFilters.value)
});
</script>

<style scoped>
.layout-wrapper {
    position: relative;
    min-height: calc(100vh - 64px); /* Adjust based on your header height */
}

.filter-toggle-btn {
    position: fixed;
    top: 80px;
    left: 20px;
    z-index: 998;
}

.floating-sidebar {
    height: 100%;
    width: 100%;
    border-radius: 7px;
    overflow-y: auto;
    padding: 1rem;
}

.main-content {
    transition: margin-left 0.3s ease;
}

.main-content.with-sidebar {
    margin-left: 380px;
}

/* Transition animations */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.sidebar-container {
    position: fixed;
    top: 120px;
    left: 20px;
    bottom: 20px;
    z-index: 997;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    width: 380px;
    transform-origin: left;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 998;
}

.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 996;
}

/* Media queries for responsive design */
@media (max-width: 1024px) {
    .sidebar-container {
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        max-width: 320px;
        margin: 0;
        border-radius: 0;
        /* Keep shadow only on the right side for mobile */
        box-shadow: 2px 0 6px -1px rgba(0, 0, 0, 0.1);
    }

    .floating-sidebar {
        padding-top: 50px; /* Space for close button */
    }

    .main-content.with-sidebar {
        margin-left: 0;
    }

    /* Adjust transition for mobile slide-in */
    .slide-enter-from,
    .slide-leave-to {
        transform: translateX(-100%);
    }

}
</style>