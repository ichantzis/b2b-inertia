<script setup>
import { ref, computed, useTemplateRef, onMounted, onUnmounted, watchEffect } from 'vue';
import { usePage, useForm, Link, router } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LinksMenu from '@/components/primevue/LinksMenu.vue';
import LinksMenuBar from '@/components/primevue/LinksMenuBar.vue';
import LinksPanelMenu from '@/components/primevue/LinksPanelMenu.vue';
import Popover from 'primevue/popover';
import { Menu } from 'primevue';

const page = usePage();

const currentRoute = computed(() => {
    // Access page.url to trigger re-computation on navigation.
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const url = page.url;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return route().current();
});

const op = ref();

// Add computed property for user name with null checks
const userName = computed(() => {
    return page.props.auth?.user?.name || 'User';
});

// Main menu
const mainMenuItems = computed(() => {
    const items = [];

    // Only add Dashboard if user is admin
    if (page.props.auth?.user?.role === 'admin') {
        items.push({
            label: 'Dashboard',
            route: route('dashboard'),
            icon: 'pi pi-fw pi-home',
            active: currentRoute.value == 'dashboard',
            command: () => {
                mobileMenuOpen.value = false;
            }
        });
    }

    // Add collections with submenu
    items.push({
        label: 'Collections',
        icon: 'pi pi-fw pi-th-large',
        expanded: true, // Add this to show submenu by default
        items: [
            {
                label: 'All Collections',
                // icon: 'pi pi-fw pi-images',
                route: route('collections'),
                command: () => {
                    mobileMenuOpen.value = false;
                }
            },
            ...(page.props.lists || []).map(list => ({
                label: list.name,
                icon: list.cover,
                route: route('collection.filtered', { list_id: list.list_id }),
                command: () => {
                    mobileMenuOpen.value = false;
                }
            }))
        ]
    });

    // Add other menu items
    items.push({
        label: 'Artworks',
        route: route('artworks'),
        icon: 'pi pi-fw pi-images',
        active: currentRoute.value == 'artworks',
        command: () => {
            mobileMenuOpen.value = false;
        }
    });

    return items;
});

// User menu (desktop)
const userMenu = useTemplateRef('user-menu');
const logoutForm = useForm({});
const userMenuItems = [
    {
        label: 'Profile',
        route: route('profile.edit'),
        icon: 'pi pi-fw pi-user',
        command: () => {
            op.value.hide();
        },
    },
    {
        label: 'Log Out',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
            op.value.hide();
            logoutForm.post(route('logout'));
        },
    },
];
const visible = ref(false);
const toggleUserMenu = (event) => {
    const isAuthenticated = page.props.auth?.user;

    if (!isAuthenticated) {
        router.visit(route('login'));
        return;
    }
    op.value.toggle(event);
};

// Mobile menu (Drawer)
const homeMobileMenuItems = computed(() => mainMenuItems.value);
const mobileMenuOpen = ref(false);

// Function to open drawer menu
const openMenu = () => {
    mobileMenuOpen.value = true;
};
</script>

<template>
    <div>
        <div class="min-h-screen">
            <nav class="dynamic-bg shadow-sm">
                <Container class="relative max-w-none">
                    <!-- Logo - Absolute Center -->
                    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <Link :href="route('welcome')">
                        <ApplicationLogo
                            class="block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" />
                        </Link>
                    </div>

                    <LinksMenuBar pt:root:class="py-8 sm:py-10 md:py-12 border-0 rounded-none dynamic-bg w-full"
                        pt:container:class="p-0" pt:start:class="w-1/3 pl-4" pt:end:class="w-1/3 flex justify-end pr-4">
                        <!-- Left Side - Hamburger Menu -->
                        <template #start>
                            <Button severity="secondary" icon="pi pi-bars" pt:root:class="p-0" pt:icon:class="text-xl"
                                text @click="openMenu" />
                        </template>

                        <!-- Right Side - User Menu -->
                        <template #end>
                            <div class="flex items-center">
                                <Button id="user-menu-btn" severity="secondary" icon="pi pi-user" pt:root:class="p-0"
                                    pt:icon:class="text-xl" text aria-label="User menu" @click="toggleUserMenu" />
                                <Button id="cart-menu-btn" severity="secondary" icon="pi pi-shopping-cart" pt:root:class="p-0"
                                    pt:icon:class="text-xl" text aria-label="Cart menu" />
                                <Popover ref="op" target="#user-menu-btn" :showCloseIcon="false">
                                    <div class="p-2 w-48">
                                        <LinksPanelMenu :model="userMenuItems" class="border-none" />
                                    </div>
                                </Popover>
                            </div>
                        </template>
                    </LinksMenuBar>
                </Container>

                <!-- Drawer Menu (now used for all screen sizes) -->
                <Drawer v-model:visible="mobileMenuOpen" position="left">
                    <template #header>
                        <h3 class="font-bold text-xl">Menu</h3>
                    </template>
                    <div class="space-y-5">
                        <div class="flex flex-col gap-2">
                            <LinksPanelMenu :model="mainMenuItems" class="w-full" />
                        </div>
                    </div>
                </Drawer>
            </nav>

            <!-- Page Content -->
            <Toast position="top-center" />
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-popover) {
    border-radius: var(--border-radius);
    box-shadow: var(--overlay-shadow);
}

:deep(.p-popover .p-panelmenu) {
    border: none;
}
</style>
