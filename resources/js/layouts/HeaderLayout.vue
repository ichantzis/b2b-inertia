<script setup>
import { ref, computed, useTemplateRef, onMounted, onUnmounted, watchEffect } from 'vue';
import { usePage, useForm, Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LinksMenu from '@/components/primevue/LinksMenu.vue';
import LinksMenuBar from '@/components/primevue/LinksMenuBar.vue';
import LinksPanelMenu from '@/components/primevue/LinksPanelMenu.vue';

const page = usePage();
const currentRoute = computed(() => {
    // Access page.url to trigger re-computation on navigation.
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const url = page.url;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return route().current();
});

// Add computed property for user name with null checks
const userName = computed(() => {
    return page.props.auth?.user?.name || 'User';
});

// Main menu
const mainMenuItems = computed(() => [
    {
        label: 'Dashboard',
        route: route('dashboard'),
        active: currentRoute.value == 'dashboard',
    },
    {
        label: 'Artworks',
        route: route('artworks'),
        active: currentRoute.value == 'artworks',
    },
]);

// User menu (desktop)
const userMenu = useTemplateRef('user-menu');
const logoutForm = useForm({});
const userMenuItems = [
    {
        label: 'Profile',
        route: route('profile.edit'),
        icon: 'pi pi-fw pi-user',
    },
    {
        label: 'Log Out',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
            logoutForm.post(route('logout'));
        },
    },
];
const toggleUserMenu = (event) => {
    userMenu.value.childRef.toggle(event);
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
                            <ApplicationLogo class="block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" />
                        </Link>
                    </div>

                    <LinksMenuBar
                        pt:root:class="py-8 sm:py-10 md:py-12 border-0 rounded-none dynamic-bg w-full"
                        pt:container:class="p-0"
                        pt:start:class="w-1/3 pl-4"
                        pt:end:class="w-1/3 flex justify-end pr-4"
                    >
                        <!-- Left Side - Hamburger Menu -->
                        <template #start>
                            <Button
                                severity="secondary"
                                icon="pi pi-bars"
                                pt:root:class="p-0"
                                pt:icon:class="text-xl"
                                text
                                @click="openMenu"
                            />
                        </template>

                        <!-- Right Side - User Menu -->
                        <template #end>
                            <div class="flex flex-col">
                                <Button
                                    id="user-menu-btn"
                                    severity="secondary"
                                    :label="userName"
                                    icon="pi pi-angle-down"
                                    iconPos="right"
                                    pt:root:class="p-0"
                                    text
                                    @click="toggleUserMenu($event)"
                                />
                                <div id="user-menu-append" class="relative"></div>
                                <LinksMenu
                                    ref="user-menu"
                                    appendTo="#user-menu-append"
                                    :model="userMenuItems"
                                    pt:root:class="left-auto! top-0! right-0"
                                    popup
                                />
                            </div>
                        </template>
                    </LinksMenuBar>
                </Container>

                <!-- Drawer Menu (now used for all screen sizes) -->
                <Drawer
                    v-model:visible="mobileMenuOpen"
                    position="left"
                >
                    <template #header>
                        <h3 class="font-bold text-xl">Menu</h3>
                    </template>
                    <div class="space-y-5">
                        <div class="flex flex-col gap-2">
                            <LinksPanelMenu
                                :model="mainMenuItems"
                                class="w-full"
                            />
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
