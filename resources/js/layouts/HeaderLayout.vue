<script setup>
import { ref, computed, useTemplateRef, onMounted, onUnmounted, watch, nextTick, watchEffect } from 'vue';
import { usePage, useForm, Link, router } from '@inertiajs/vue3';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LinksMenu from '@/components/primevue/LinksMenu.vue';
import LinksMenuBar from '@/components/primevue/LinksMenuBar.vue';
import LinksPanelMenu from '@/components/primevue/LinksPanelMenu.vue';
import Popover from 'primevue/popover';
import { useToast } from 'primevue/usetoast';
import { Menu } from 'primevue';

const page = usePage();

const toast = useToast();

const currentRoute = computed(() => {
    // Access page.url to trigger re-computation on navigation.
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const url = page.url;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return route().current();
});

const cartCount = computed(() => page.props.cartCount || 0);
const cartItemsPreview = computed(() => {
    return (page.props.cartItemsPreview.map(item => ({
        ...item,
        formattedPrice: item.artwork_data?.price // format price
            ? Number(item.artwork_data.price).toFixed(2)
            : '0.00'
    })) || []);
}); // Get items
const isCartEmpty = computed(() => cartItemsPreview.value.length === 0);

const cartSubtotal = computed(() => {
    const total = cartItemsPreview.value.reduce((sum, item) => {
        const price = Number(item.artwork_data?.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + (price * quantity);
    }, 0);
    return total.toFixed(2);
});


const op = ref();
const cartOp = ref(); // Cart popover ref
const cartOpTimer = ref(null); // Timer for hover delay
const userOpTimer = ref(null); // Timer for user menu hover delay

// Add computed property for user name with null checks
const userName = computed(() => {
    return page.props.auth?.user?.name || 'User';
});

// Main menu
const mainMenuItems = computed(() => {
    const items = [];

    items.push({
        label: 'Home',
        route: route('welcome'),
        icon: 'pi pi-fw pi-home',
        active: currentRoute.value == '/',
        command: () => {
            mobileMenuOpen.value = false;
        }
    });

    // Only add Dashboard if user is admin
    if (page.props.auth?.user?.role === 'admin') {
        items.push({
            label: 'Dashboard',
            route: route('dashboard'),
            icon: 'pi pi-fw pi-sliders-h',
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
        route: route('collections.index'),
                command: () => {
                    mobileMenuOpen.value = false;
                },
        expanded: true, // Add this to show submenu by default
    });

    // Add collections with submenu
    items.push({
        label: 'Lists',
        icon: 'pi pi-fw pi-th-large',
        expanded: true, // Add this to show submenu by default
        items: [
            {
                label: 'All Lists',
                // icon: 'pi pi-fw pi-images',
                route: route('lists'),
                command: () => {
                    mobileMenuOpen.value = false;
                }
            },
            ...(page.props.lists || []).map(list => ({
                label: list.name,
                icon: list.cover,
                route: route('list.filtered', { list_id: list.list_id }),
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

// Add these near other menu functions
const showUserPopover = (event) => {
    const isAuthenticated = page.props.auth?.user;
    if (isAuthenticated) {
        clearTimeout(userOpTimer.value);
        op.value?.show(event);
    }
};

const handleUserClick = () => {
    const isAuthenticated = page.props.auth?.user;
    if (!isAuthenticated) {
        router.visit(route('login'));
    }
};

const hideUserPopover = () => {
    userOpTimer.value = setTimeout(() => {
        op.value?.hide();
    }, 150);
};

const clearUserHideTimer = () => {
    clearTimeout(userOpTimer.value);
};


// Mobile menu (Drawer)
const homeMobileMenuItems = computed(() => mainMenuItems.value);
const mobileMenuOpen = ref(false);

// Function to open drawer menu
const openMenu = () => {
    mobileMenuOpen.value = true;
};

// Add these new refs for scroll handling
const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);

// Add scroll handler
const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    isHeaderVisible.value =
        currentScroll < lastScrollPosition.value || // Scrolling up
        currentScroll < 50; // Near top
    lastScrollPosition.value = currentScroll;
};

// --- Cart Popover Hover Logic ---
const showCartPopover = (event) => {
    clearTimeout(cartOpTimer.value); // Clear any pending hide timer
    if (!cartOp.value.isUnstyled) { // Check internal state if needed, or just toggle
        cartOp.value.show(event, event.currentTarget);
    } else {
        cartOp.value.show(event);
    }

};

const hideCartPopover = () => {
    // Add a small delay before hiding to allow moving mouse into popover
    cartOpTimer.value = setTimeout(() => {
        cartOp.value?.hide(); // Use optional chaining
    }, 150); // Adjust delay (ms) as needed
};

const clearCartHideTimer = () => {
    clearTimeout(cartOpTimer.value);
};

const handleDeleteItem = (itemId) => {
    router.delete(route('cart.destroy', itemId), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            // Optional: show success toast
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item removed from cart',
                life: 3000
            });
        },
        onError: (errors) => {
            console.error('Failed to delete item:', errors);
            // Optional: Show error message
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not delete item from cart. Please try again.',
                life: 5000
            });
        }
    });
};

watch(() => page.props.flash?.login_success_message, (newMessage) => {
  if (newMessage) {
    // Wait for the next DOM update cycle before showing the toast
    nextTick(() => {
        try {
          toast.add({
              severity: 'success',
              summary: 'Logged In',
              detail: newMessage,
              life: 3000 // Keep it slightly longer for testing if needed
          });
        } catch (error) {
          console.error('Error calling toast.add() inside nextTick:', error);
        }
    });

    // Clear the flash message from Inertia's props immediately after detecting it
    // so the watcher doesn't re-trigger unnecessarily if other props change.
    // Do this *outside* nextTick.
    if (page.props.flash) {
        page.props.flash.login_success_message = null;
    }
  }
}, { immediate: true }); // immediate: true is still correct here

// Add lifecycle hooks
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div>
        <div class="min-h-screen">
            <nav :class="[
                'dynamic-bg shadow-sm fixed w-full transition-transform duration-300 z-50',
                { '-translate-y-full': !isHeaderVisible }
            ]">
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
                                <Button id="user-menu-btn" 
                                    severity="secondary" 
                                    icon="pi pi-user" 
                                    pt:root:class="p-0"
                                    pt:icon:class="text-xl" 
                                    text 
                                    aria-label="User menu" 
                                    @mouseenter="showUserPopover"
                                    @mouseleave="hideUserPopover"
                                    @click="handleUserClick" />
                                <Link :href="route('cart.index')" class="ml-4" @mouseenter="showCartPopover"
                                    @mouseleave="hideCartPopover" aria-haspopup="true"
                                    aria-controls="cart-popover-content">
                                <OverlayBadge v-if="cartCount > 0" :value="String(cartCount)">
                                    <Button id="cart-menu-btn" severity="secondary" icon="pi pi-shopping-cart"
                                        pt:root:class="p-0" pt:icon:class="text-xl" text aria-label="Cart menu" />
                                </OverlayBadge>
                                <Button v-else id="cart-menu-btn" severity="secondary" icon="pi pi-shopping-cart"
                                    pt:root:class="p-0" pt:icon:class="text-xl" text aria-label="Cart menu" />
                                </Link>
                                <Popover ref="op" 
                                    target="#user-menu-btn" 
                                    :showCloseIcon="false"
                                    @mouseenter="clearUserHideTimer" 
                                    @mouseleave="hideUserPopover">
                                    <div class="p-2 w-48">
                                        <LinksPanelMenu :model="userMenuItems" class="border-none" />
                                    </div>
                                </Popover>
                                <Popover ref="cartOp" id="cart-popover-content" target="#cart-menu-btn"
                                    @mouseenter="clearCartHideTimer" @mouseleave="hideCartPopover">
                                    <div class="p-4 w-[300px] max-h-[400px] overflow-y-auto">
                                        <h4 class="font-semibold mb-3">Shopping Cart</h4>
                                        <div v-if="isCartEmpty" class="text-center text-muted-color">
                                            Your cart is empty.
                                        </div>
                                        <div v-else class="flex flex-col gap-3">
                                            <div v-for="item in cartItemsPreview" :key="item.id"
                                                class="flex items-center gap-2 border-b pb-2 dynamic-border last:border-b-0">
                                                <img v-if="item.artwork_data?.img_thumb"
                                                    :src="item.artwork_data.img_thumb" :alt="item.artwork_data.title"
                                                    class="w-12 h-12 object-cover rounded flex-shrink-0" />
                                                <div v-else
                                                    class="w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0">
                                                    No Img</div>
                                                <div class="flex-grow min-w-0">
                                                    <p class="font-medium text-sm truncate">{{ item.artwork_data?.title
                                                        || 'Untitled' }}</p>
                                                    <p class="text-sm text-muted-color">Type: {{ item.type }}</p>
                                                    <p class="text-sm text-muted-color">Frame: {{ item.frame }}</p>
                                                    <p class="text-sm text-muted-color">Size: {{ item.size }}</p>
                                                    <p class="text-sm text-muted-color">{{ item.quantity }} x €{{
                                                        item.formattedPrice }}</p>
                                                </div>
                                                <Button icon="pi pi-times-circle" text rounded aria-label="Delete item"
                                                    @click="handleDeleteItem(item.id)" />
                                            </div>
                                            <div v-if="!isCartEmpty" class="mt-3 pt-2 dynamic-border">
                                                <p class="text-sm font-semibold flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>€{{ cartSubtotal }}</span>
                                                </p>
                                            </div>
                                            <Link :href="route('cart.index')" class="block mt-2">
                                            <Button label="View Full Cart" severity="primary" size="small"
                                                class="w-full" />
                                            </Link>
                                        </div>
                                    </div>
                                </Popover>
                            </div>
                        </template>
                    </LinksMenuBar>
                </Container>
            </nav>

            <!-- Add padding to prevent content from going under fixed header -->
            <div class="h-[120px]"></div>

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

/* Add these new styles */
nav {
    top: 0;
    transform-origin: top;
    backface-visibility: hidden;
}
</style>
