<script setup>
import { ref, computed, watch } from 'vue'; // Added watch
import { Link, usePage, router } from '@inertiajs/vue3';
import PanelMenu from 'primevue/panelmenu'; // Ensuring correct import name

const page = usePage();

const collectionTreeData = computed(() => page.props.allCollectionCategoriesWithCollections || []);

// State for "Show More" functionality for each category's collection list
const showMoreState = ref({}); // Key: category_id, Value: boolean for showing all collections

const toggleShowMoreCollections = (categoryId) => {
  showMoreState.value[categoryId] = !showMoreState.value[categoryId];
};

// Ref to control which panels (categories) are expanded
const expandedCategoryKeys = ref({});

const menuItems = computed(() => {
  return (collectionTreeData.value || []).map(category => {
    const collections = category.collections || [];
    const isShowMoreActive = showMoreState.value[category.category_id] || false;
    const visibleCollections = isShowMoreActive ? collections : collections.slice(0, 3);

    const subItems = visibleCollections.map(collection => ({
      label: collection.name,
      key: `${category.category_id}-${collection.id}`, // Unique key for sub-item
      command: () => {
        router.visit(route('collection.show', { collection_slug: collection.slug }));
      }
    }));

    if (collections.length > 3) {
      subItems.push({
        label: isShowMoreActive ? '- Show less' : `+ Show ${collections.length - 3} more`,
        key: `${category.category_id}-${isShowMoreActive ? 'showless' : 'showmore'}`,
        command: (event) => {
          // Important: Prevent the panel itself from toggling when "Show more/less" is clicked
          if (event && event.originalEvent) {
            event.originalEvent.stopPropagation();
          }
          toggleShowMoreCollections(category.category_id);
        },
        class: 'show-more-item'
      });
    }

    return {
      key: category.category_id, // This key will be used in expandedCategoryKeys
      label: category.category_name,
      items: subItems.length > 0 ? subItems : undefined, // Only add items array if there are collections/showMore
      command: () => { // Command for clicking the category header itself
        router.visit(route('collections.category.show', { category_collection_slug: category.category_slug }));
      },
    };
  });
});

// Watch the collectionTreeData to initialize expandedKeys when data is available.
// This ensures all main categories are marked as expanded initially.
watch(collectionTreeData, (newTreeData) => {
  const keys = {};
  if (newTreeData && Array.isArray(newTreeData)) {
    newTreeData.forEach(category => {
      if (category.category_id) { // Ensure item has a key
        keys[category.category_id] = true; // Set to true to expand
      }
    });
  }
  expandedCategoryKeys.value = keys;
}, { immediate: true, deep: true }); // immediate: true to run on initial load, deep if tree structure might change internally

</script>

<template>
  <aside class="collection-sidebar print:hidden">
    <div class="sidebar-content">
      <h3 class="text-lg font-semibold mb-4 px-3 text-gray-700">Collections</h3>
      <PanelMenu :model="menuItems" v-model:expandedKeys="expandedCategoryKeys" class="w-full custom-panel-menu"
        multiple />
    </div>
  </aside>
</template>

<style scoped>
.collection-sidebar {
  margin-inline: 1rem;
  width: 280px;
  /* Fixed width for the sidebar */
  position: fixed;
  /* Floating sidebar */
  top: 120px;
  /* Adjust based on your header's height, make it dynamic if header height changes */
  left: 0;
  bottom: 0;
  /* background-color: #f8f9fa; */
  /* Light background */
  /* border: 1px solid #e5e7eb; */
  border-radius: 5px;
  /* Subtle border */
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  overflow-y: auto;
  z-index: 40;
  /* Below header (z-50) but above content */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Added box-shadow transition */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1), 2px 0 5px rgba(0,0,0,0.05); /* Softer, more spread out shadow */
}

/* Hide sidebar on screens narrower than 1200px */
@media (max-width: 1199.98px) {
  .collection-sidebar {
    transform: translateX(-100%);
    box-shadow: none;
    /* Slide out */
    /* Or display: none; if you don't want slide animation */
  }
}

.sidebar-content {
  padding: 0 0.5rem;
  /* Inner padding for content */
}

/* Styling for PrimeVue PanelMenu */
.custom-panel-menu :deep(.p-panelmenu-header) {
  /* padding: 0.75rem 1rem; */
  background-color: transparent;
  border: none;
  font-weight: 600;
  color: #4b5563;
  /* text-gray-600 */
}

.custom-panel-menu :deep(.p-panelmenu-panel) {
  /* MODIFIED: Remove border from the panel list item itself */
  border: none !important; 
  margin-bottom: 0.25rem; /* Add a little space between category groups if needed */
}

.custom-panel-menu :deep(.p-panelmenu-header) {
  /* padding: 0.75rem 1rem; */
  background-color: transparent;
  border: none !important; /* Ensure no border on the action/link */
  font-weight: 600; 
  color: #4b5563; 
  border-radius: 4px; /* Optional: slightly round the header action area */
  transition: background-color 0.2s ease;
}

/* MODIFIED: Remove the chevron icon from category titles (panel headers) */
.custom-panel-menu :deep(.p-panelmenu-header .p-panelmenu-header-icon),
.custom-panel-menu :deep(.p-panelmenu-header .p-icon.p-panelmenu-submenu-icon) { /* PrimeVue 3 uses .p-icon.p-panelmenu-toggler */
  display: none !important;
}

.custom-panel-menu :deep(.p-panelmenu-header-action .p-menuitem-text) {
  font-weight: 600;
  /* Explicitly bold category titles */
}

.custom-panel-menu :deep(.p-panelmenu-header:hover) {
  background-color: #e9ecef;
  /* Light hover */
}

.custom-panel-menu :deep(.p-menuitem-text) {
  color: #374151;
  /* text-gray-700 */
  font-size: 0.9rem;
}

.custom-panel-menu :deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
  color: #6b7280;
  /* text-gray-500 */
}

.custom-panel-menu :deep(.p-panelmenu-content) {
  border: none;
  padding-left: 1.5rem;
  /* Indent collection items */
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.custom-panel-menu :deep(.p-panelmenu-item > .p-menuitem-content > .p-menuitem-link .p-menuitem-text) {
  /* Sub-item text */
  font-size: 0.875rem;
  color: #4b5563;
}

.custom-panel-menu :deep(.p-panelmenu-item > .p-menuitem-content > .p-menuitem-link:hover .p-menuitem-text) {
  color: var(--p-primary-color, #007bff);
}

/* Styling for "Show more/less" items */
.custom-panel-menu :deep(.show-more-item) {
  font-style: italic;
  color: var(--p-primary-color, #007bff) !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  /* MODIFIED: Added bold font weight */
}

.custom-panel-menu :deep(.show-more-item),
.custom-panel-menu :deep(.show-more-item) {
  /* background-color: rgba(var(--p-primary-color-rgb, 0, 123, 255), 0.05) !important;  */
}
</style>