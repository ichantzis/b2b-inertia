<script setup>
import { computed, defineEmits } from 'vue'; // Import defineEmits
import { usePage, Link } from '@inertiajs/vue3';
import PanelMenu from 'primevue/panelmenu';
import ApplicationLogo from '@/components/ApplicationLogo.vue';

const page = usePage();
const emit = defineEmits(['navigate']); // Define the event

const currentRoute = computed(() => page.props.ziggy?.current_route_name);

const adminMenuItems = computed(() => [
    {
        label: 'Overview',
        icon: 'pi pi-fw pi-home',
        route: route('dashboard.index'),
        active: currentRoute.value === 'dashboard.index'
    },
    {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        route: route('dashboard.orders.index'),
        active: currentRoute.value && currentRoute.value.startsWith('dashboard.orders')
    },
    { // Add this for Users
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        route: route('dashboard.users.index'),
        active: currentRoute.value && currentRoute.value.startsWith('dashboard.users')
    },
    // {
    //     label: 'Management',
    //     icon: 'pi pi-fw pi-cog',
    //     expanded: currentRoute.value?.startsWith('dashboard.orders') || currentRoute.value?.startsWith('dashboard.users'), // Example expansion logic
    //     items: [
    //         {
    //             label: 'Orders',
    //             icon: 'pi pi-fw pi-shopping-cart',
    //             route: route('dashboard.orders.index'),
    //             active: currentRoute.value && currentRoute.value.startsWith('dashboard.orders')
    //         },
    //         // {
    //         //     label: 'Users',
    //         //     icon: 'pi pi-fw pi-users',
    //         //     route: route('dashboard.users.index'), // Example
    //         //     active: currentRoute.value === 'dashboard.users.index'
    //         // }
    //     ]
    // },
    {
        separator: true
    },
    {
        label: 'Back to Site',
        icon: 'pi pi-fw pi-arrow-left',
        route: route('welcome'),
    }
]);

const handleNavigation = () => {
    emit('navigate'); // Emit event on navigation
};

const panelMenuItems = computed(() => {
    const mapItems = (items) => {
        return items.map(item => {
            const newItem = { ...item };
            if (item.route) {
                // The command will be handled by the Link component's click
                // and our handleNavigation for emitting the event.
            }
            if (item.items) {
                newItem.items = mapItems(item.items);
            }
            return newItem;
        });
    };
    return mapItems(adminMenuItems.value);
});

</script>

<template>
    <div class="admin-sidebar p-4 h-full bg-surface-100 dark:bg-surface-800 flex flex-col shadow-lg">
        <div class="mb-6 text-center">
            <Link :href="route('dashboard.index')" @click="handleNavigation" class="no-underline">
            <ApplicationLogo class="h-10 sm:h-12 mx-auto" />
            <h1 class="text-lg sm:text-xl font-semibold mt-2 text-primary-500 dark:text-primary-400">Admin Panel</h1>
            </Link>
        </div>

        <PanelMenu :model="panelMenuItems" class="w-full">
            <template #item="{ item }">
                <Link v-if="item.route" :href="item.route" @click="handleNavigation"
                    class="p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base"
                    :class="{ 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600': item.active, 'text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700': !item.active }">
                <span :class="[item.icon, 'mr-2 text-base sm:text-lg']"></span>
                <span>{{ item.label }}</span>
                </Link>
                <a v-else-if="!item.separator && item.items" tabindex="0"
                    class="p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700"
                    :class="{ 'bg-surface-200 dark:bg-surface-700 font-semibold': item.expanded }">
                    <span v-if="item.icon" :class="[item.icon, 'mr-2 text-base sm:text-lg']"></span>
                    <span>{{ item.label }}</span>
                    <span v-if="item.items" class="pi pi-angle-down ml-auto text-xs"
                        :class="{ 'pi-angle-up': item.expanded }"></span>
                </a>
                <div v-if="item.separator" class="my-2 border-t border-surface-300 dark:border-surface-600"></div>
            </template>
        </PanelMenu>
        <div class="mt-auto text-center p-2 text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            <p>&copy; {{ new Date().getFullYear() }} YourApp</p>
        </div>
    </div>
</template>

<style scoped>
.admin-sidebar {
    background-color: var(--p-surface-100);
    color: var(--p-text-color);
    height: auto;
}

:deep(.p-panelmenu .p-panelmenu-header-action) {
    /* Styles for headers if you make them clickable for expansion */
    /* This targets the clickable area of a sub-menu header */
}

:deep(.p-panelmenu .p-menuitem-link) {
    text-decoration: none;
}

/* Ensure PanelMenu itself doesn't have unwanted borders or padding if Sidebar adds its own */
:deep(.p-panelmenu) {
    border: none;
    background: transparent;
}
</style>