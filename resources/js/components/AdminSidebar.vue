<script setup>
import { ref, computed, watch, defineEmits } from 'vue';
import { usePage, Link } from '@inertiajs/vue3';
import PanelMenu from 'primevue/panelmenu';
import ApplicationLogo from '@/components/ApplicationLogo.vue';

const page = usePage();
const emit = defineEmits(['navigate']);

const currentRoute = computed(() => page.props.ziggy?.current_route_name);

// 1. Ορίζουμε ένα reactive αντικείμενο για τον έλεγχο των ανοιχτών μενού
const expandedKeys = ref({});

const baseMenuItems = [
    {
        label: 'Overview',
        icon: 'pi pi-fw pi-home',
        routeName: 'dashboard.index',
        route: route('dashboard.index'),
    },
    {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        routeName: 'dashboard.orders',
        route: route('dashboard.orders.index'),
    },
    {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routeName: 'dashboard.users',
        route: route('dashboard.users.index'),
    },
    { 
        label: 'Coupons',
        icon: 'pi pi-fw pi-tags',
        routeName: 'dashboard.coupons',
        route: route('dashboard.coupons.index'),
    },
    {
        key: 'settings-content', // Το μοναδικό κλειδί για το group των ρυθμίσεων
        label: 'Settings & Content',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'General Settings',
                icon: 'pi pi-fw pi-sliders-h',
                routeName: 'dashboard.settings.general',
                route: route('dashboard.settings.general'),
            },
            {
                label: 'Homepage Design',
                icon: 'pi pi-fw pi-image',
                routeName: 'dashboard.settings.homepage',
                route: route('dashboard.settings.homepage'),
            },
            {
                label: 'Pricing Rules',
                icon: 'pi pi-fw pi-dollar',
                routeName: 'dashboard.settings.pricing',
                route: route('dashboard.settings.pricing'),
            },
            {
                label: 'Curated Lists',
                icon: 'pi pi-fw pi-list',
                routeName: 'dashboard.settings.lists',
                route: route('dashboard.settings.lists.index'),
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Back to Site',
        icon: 'pi pi-fw pi-arrow-left',
        route: route('welcome'),
    }
];

// 2. Υπολογισμός μόνο του active state για τα απλά links
const panelMenuItems = computed(() => {
    const current = currentRoute.value || '';

    const buildMenu = (items) => {
        return items.map(item => {
            const newItem = { ...item };
            if (newItem.items) {
                newItem.items = buildMenu(newItem.items);
            } else if (newItem.routeName) {
                newItem.active = current.startsWith(newItem.routeName);
            }
            return newItem;
        });
    };

    return buildMenu(baseMenuItems);
});

// 3. Watcher που ανοίγει αυτόματα το μενού αν βρισκόμαστε σε σελίδα ρυθμίσεων/λιστών
watch(currentRoute, (current) => {
    if (current && (current.startsWith('dashboard.settings') || current.startsWith('dashboard.lists'))) {
        expandedKeys.value = { 'settings-content': true };
    } else {
        expandedKeys.value = {};
    }
}, { immediate: true });

const handleNavigation = () => {
    emit('navigate');
};
</script>

<template>
    <div class="admin-sidebar p-4 h-full bg-surface-100 dark:bg-surface-800 flex flex-col shadow-lg">
        <div class="mb-6 text-center">
            <Link :href="route('dashboard.index')" @click="handleNavigation" class="no-underline">
                <ApplicationLogo class="h-10 sm:h-12 mx-auto" />
                <h1 class="text-lg sm:text-xl font-semibold mt-2 text-primary-500 dark:text-primary-400">Admin Panel</h1>
            </Link>
        </div>

        <!-- Συνδέουμε το v-model:expandedKeys -->
        <PanelMenu :model="panelMenuItems" v-model:expandedKeys="expandedKeys" class="w-full">
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
            <p>&copy; {{ new Date().getFullYear() }} Pinakothiki</p>
        </div>
    </div>
</template>

<style scoped>
.admin-sidebar {
    background-color: var(--p-surface-100);
    color: var(--p-text-color);
    height: auto;
}

:deep(.p-panelmenu .p-menuitem-link) {
    text-decoration: none;
}

:deep(.p-panelmenu) {
    border: none;
    background: transparent;
}
</style>