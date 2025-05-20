<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { usePage, Link } from '@inertiajs/vue3';
import AdminSidebar from '@/components/AdminSidebar.vue'; // Verify path
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button'; // Import Button
import Sidebar from 'primevue/sidebar'; // Import Sidebar (Drawer)

const props = defineProps({
    title: {
        type: String,
        default: 'Dashboard'
    }
});

const page = usePage();
const toast = useToast();

const adminName = computed(() => page.props.auth?.user?.name || 'Admin');
const mobileMenuOpen = ref(false); // State for mobile sidebar

// Watch for flash messages
watch(() => page.props.flash, (flashMessages) => {
    if (flashMessages) {
        nextTick(() => {
            try {
                if (flashMessages.success) {
                    toast.add({ severity: 'success', summary: 'Success', detail: flashMessages.success, life: 3000 });
                }
                if (flashMessages.error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: flashMessages.error, life: 5000 });
                }
                // Add other flash message types if needed
            } catch (error) {
                console.error('Error showing toast in AdminLayout:', error);
            }
        });
    }
}, { deep: true });

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

</script>

<template>
    <div>
        <Toast position="top-center" />
        <div class="min-h-screen flex bg-surface-50 dark:bg-surface-900">
            <AdminSidebar class="w-64 flex-shrink-0 hidden lg:block" />

            <Sidebar v-model:visible="mobileMenuOpen" position="left" class="lg:hidden w-full sm:w-72">
                <AdminSidebar @navigate="mobileMenuOpen = false" />
            </Sidebar>

            <div class="flex-1 flex flex-col overflow-hidden">
                <header class="bg-white dark:bg-surface-800 shadow-md">
                    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <Button icon="pi pi-bars"
                                    class="lg:hidden mr-3 p-button-text text-surface-600 dark:text-surface-300"
                                    @click="toggleMobileMenu" aria-label="Open menu" />
                                <h2
                                    class="text-xl font-semibold text-surface-800 dark:text-surface-100 hidden lg:block">
                                    <slot name="header-title">{{ props.title }}</slot>
                                </h2>
                            </div>

                            <div class="flex items-center">
                                <span class="mr-4 text-sm text-surface-600 dark:text-surface-300 hidden sm:inline">
                                    Welcome, {{ adminName }}
                                </span>
                                <Link :href="route('logout')" method="post" as="button"
                                    class="p-button p-button-text p-button-sm text-surface-600 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400">
                                <i class="pi pi-sign-out mr-1"></i>
                                <span>Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div class="lg:hidden px-4 pb-2 pt-1 border-t border-surface-200 dark:border-surface-700"
                        v-if="$slots['header-title']">
                        <h2 class="text-lg font-semibold text-surface-800 dark:text-surface-100 text-center">
                            <slot name="header-title">Dashboard</slot>
                        </h2>
                    </div>
                </header>

                <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ensure PrimeVue icons are styled correctly if not globally done */
:deep(.p-button.p-button-text) {
    color: inherit;
    /* Or specific color */
}

/* Additional styling for mobile header if needed */
.container {
    max-width: 100%;
    /* Or your preferred max-width */
}
</style>