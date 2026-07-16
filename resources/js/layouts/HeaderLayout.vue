<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { usePage, useForm, Link, router } from '@inertiajs/vue3';
import LinksMenuBar from '@/components/primevue/LinksMenuBar.vue';
import LinksPanelMenu from '@/components/primevue/LinksPanelMenu.vue';
import Popover from 'primevue/popover';
import { useToast } from 'primevue/usetoast';
import Footer from '@/components/Footer.vue';

const page = usePage();

const toast = useToast();

// State για το expanding search
const isSearchExpanded = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);

// Εμφάνιση του input και focus
const toggleSearch = async () => {
    isSearchExpanded.value = true;
    // Χρησιμοποιούμε το nextTick για να βεβαιωθούμε ότι το DOM έχει ενημερωθεί 
    // και το input υπάρχει πριν του κάνουμε focus.
    await nextTick();
    searchInput.value?.focus();
};

const currentRoute = computed(() => {
    // Access page.url to trigger re-computation on navigation.
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const url = page.url;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return route().current();
});

const cartCount = computed(() => page.props.cartCount || 0);
const cartItemsPreview = computed(() => {
    return (page.props.cartItemsPreview?.map(item => ({
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

// Κλείσιμο του search
const closeSearch = () => {
    isSearchExpanded.value = false;
    // Προαιρετικά, μπορείς να καθαρίζεις το πεδίο: searchQuery.value = '';
};

// Η συνάρτηση που εκτελεί την αναζήτηση σωστά μέσω Inertia
const submitSearch = () => {
    if (!searchQuery.value.trim()) return;

    // Χρησιμοποιούμε το router.get του Inertia για πλοήγηση χωρίς page refresh
    router.get('/artworks', { search: searchQuery.value }, {
        preserveState: true,
        preserveScroll: true
    });
};


const op = ref();
const cartOp = ref(); // Cart popover ref
const cartOpTimer = ref(null); // Timer for hover delay
const userOpTimer = ref(null); // Timer for user menu hover delay

// Main menu
const mainMenuItems = computed(() => {
    const items = [];

    if (page.props.auth?.user?.role === 'admin') {
        items.push({
            label: 'Dashboard',
            route: route('dashboard.index'),
            icon: 'pi pi-fw pi-sliders-h',
            active: currentRoute.value == 'dashboard',
            command: () => {
                mobileMenuOpen.value = false;
            }
        });
    }

    items.push({
        label: 'Products Collection',
        icon: 'pi pi-fw pi-images',
        expanded: true, // Add this to show submenu by default
        items: [
            {
                label: 'All Collections',
                // icon: 'pi pi-fw pi-images',
                route: route('lists.index'),
                command: () => {
                    mobileMenuOpen.value = false;
                }
            },
            ...(page.props.global_data?.lists || []).map(list => ({
                label: list.name,
                icon: list.cover,
                route: route('lists.show', { slug: list.slug }),
                command: () => {
                    mobileMenuOpen.value = false;
                }
            }))
        ]
    });

    items.push({
        label: 'Frames',
        icon: 'pi pi-fw pi-objects-column',
        route: route('artworks'),
        active: currentRoute.value == 'artworks',
        command: () => {
            mobileMenuOpen.value = false;
        }
    });

    items.push({
        label: 'Artists',
        icon: 'pi pi-fw pi-palette',
        route: route('artists.overview'),
        active: currentRoute.value == 'artists.overview' || currentRoute.value == 'artists.illustrators' || currentRoute.value == 'artists.photographers' || currentRoute.value == 'artists.by_country' || currentRoute.value == 'artists.all',
        command: () => {
            mobileMenuOpen.value = false;
        }
    });

    return items;
});

// User menu (desktop)
const logoutForm = useForm({});
const userMenuItems = [
    {
        label: 'My Orders',
        route: route('account.orders.index'),
        icon: 'pi pi-fw pi-shopping-bag',
        command: () => {
            op.value.hide();
        },
    },
    // {
    //     label: 'Addresses',
    //     route: route('account.addresses.index'),
    //     icon: 'pi pi-fw pi-map-marker',
    //     command: () => {
    //         op.value.hide();
    //     },
    // },
    {
        label: 'Profile',
        route: route('account.profile.edit'),
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
const homeMobileMenuItems = computed(() => {
    return [
        {
            label: 'Home',
            route: route('welcome'),
            icon: 'pi pi-fw pi-home',
            active: currentRoute.value === 'welcome',
            command: () => {
                mobileMenuOpen.value = false;
            }
        },
        ...mainMenuItems.value
    ];
});
const mobileMenuOpen = ref(false);

// Add these new refs for scroll handling
const isHeaderVisible = ref(true);

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

// Watch for changes in flash messages
watch(() => page.props.flash, (flashMessages) => {
    if (flashMessages) {
        // Wait for the next DOM update cycle before showing the toast
        nextTick(() => {
            try {
                if (flashMessages.success) {
                    toast.add({ severity: 'success', summary: 'Success', detail: flashMessages.success, life: 3000 });
                }
                if (flashMessages.error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: flashMessages.error, life: 3000 });
                }
                if (flashMessages.login_success_message) { // Your custom one
                    toast.add({ severity: 'success', summary: 'Logged In', detail: flashMessages.login_success_message, life: 3000 });
                }
                // Add more conditions for other flash types like 'warning' or 'info' if needed
            } catch (error) {
                console.error('Error calling toast.add() inside nextTick:', error);
            }
        });

    }
}, { deep: true, immediate: true }); // Use deep watch if flash is an object and its properties might change


// // --- SOLUTION FOR STALE CART ON BACK NAVIGATION ---
// let unregisterNavigateListener = null;

// // Add lifecycle hooks
// onMounted(() => {
//     // window.addEventListener('scroll', handleScroll);

//     unregisterNavigateListener = router.on('navigate', () => {
//         // This event fires after any Inertia navigation, including back/forward.
//         // We will ask Inertia to reload only the shared props related to the cart.
//         // This ensures that if the user navigated back to a page whose cart data was stale,
//         // it gets refreshed from the server.
//         router.reload({
//             only: ['cartCount', 'cartItemsPreview'], // Specify only the props you need to refresh
//             preserveState: true, // Attempt to preserve component state
//             preserveScroll: true, // Preserve scroll position
//             onSuccess: () => {
//                 // console.log('Cart props reloaded successfully via router.reload().');
//             },
//             onError: (errors) => {
//                 console.error('Error reloading cart props on navigate:', errors);
//             }
//         });
//     });
// });

// --- SOLUTION FOR STALE CART ON BACK NAVIGATION ---
// Replace router.on('navigate') with popstate listener

const handlePopstate = () => {
    // Reload cart data only when navigating via browser back/forward buttons
    router.reload({
        only: ['cartCount', 'cartItemsPreview'],
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            // console.log('Cart props reloaded successfully via popstate.');
        },
        onError: (errors) => {
            console.error('Error reloading cart props on popstate:', errors);
        }
    });
};

onMounted(() => {
    // window.addEventListener('scroll', handleScroll);

    // Προσθήκη listener για το Back/Forward button
    window.addEventListener('popstate', handlePopstate);
});

onUnmounted(() => {
    // window.removeEventListener('scroll', handleScroll);

    // Αφαίρεση του listener όταν το component καταστρέφεται
    window.removeEventListener('popstate', handlePopstate);
});
</script>

<template>
    <div>
        <div class="min-h-screen">
            <nav :class="[
                'dynamic-bg shadow-sm fixed w-full transition-transform duration-300 z-50',
                { '-translate-y-full': !isHeaderVisible }
            ]">

            <!-- Top Bar -->
                    <div
                        class="bg-[#eeeada] text-black text-[11px] min-h-8 py-1.5 px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 items-center gap-3 z-50 relative">

                        <div class="flex items-center gap-4">
                            <a href="https://www.facebook.com/pinakothiki.FineArtPrints"
                                class="leading-none hover:text-gray-600 transition-colors" aria-label="Facebook"
                                target="_blank" rel="noopener nofollow">
                                <i class="pi pi-facebook text-sm"></i>
                            </a>
                            <a href="https://www.instagram.com/pinakothiki/"
                                class="leading-none hover:text-gray-600 transition-colors" aria-label="Instagram"
                                target="_blank" rel="noopener nofollow">
                                <i class="pi pi-instagram text-sm"></i>
                            </a>
                            <a href="#" class="leading-none hover:text-gray-600 transition-colors"
                                aria-label="LinkedIn">
                                <i class="pi pi-linkedin text-sm"></i>
                            </a>
                        </div>

                        <div class="text-center text-[10px] leading-none tracking-normal hidden md:block">
                            Premium Art on Canvas - Custom Made by hand with Love
                        </div>

                        <div class="flex items-center justify-end gap-4 whitespace-nowrap">
                            <Link :href="route('about')" class="hover:text-gray-600 transition-colors">About Us
                            </Link>
                            <Link :href="route('collaborate')" class="hover:text-gray-600 transition-colors">Partners
                            </Link>
                            <Link :href="route('contact.index')" class="hover:text-gray-600 transition-colors">Contact
                            </Link>

                            <button
                                class="header-locale-toggle hidden items-center gap-1 hover:text-gray-600 transition-colors md:flex"
                                type="button">
                                <span>English | EUR €</span>
                                <i class="pi pi-angle-down text-[10px]"></i>
                            </button>
                            <button class="hidden items-center gap-1 hover:text-gray-600 transition-colors lg:flex"
                                type="button">
                                <span>(EUR &euro;)</span>
                                <i class="pi pi-angle-down text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                <Container class="relative max-w-none">                    

                    <LinksMenuBar :model="mainMenuItems" :key="currentRoute"
                        pt:root:class="px-0 py-4 border-0 rounded-none dynamic-bg" pt:button:class="hidden">
                        <!-- Left Side - Hamburger Menu -->
                        <template #start>
                            <!-- Mobile Hamburger -->
                            <div class="flex items-center lg:hidden">
                                <div class="relative">
                                    <Button severity="secondary" icon="pi pi-bars" pt:icon:class="text-xl" text
                                        @click="mobileMenuOpen = true" />
                                </div>
                            </div>
                            <Link :href="route('welcome')"
                                class="brand-link absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-normal leading-none text-black no-underline md:text-2xl"
                                aria-label="ART Collector home">
                                ART Collector
                            </Link>
                        </template>

                        <!-- Right Side - User Menu -->
                        <template #end>
                            <div class="flex items-center gap-3">
                                <div class="relative flex items-center justify-end h-10 w-64">
                                    <button v-if="!isSearchExpanded" @click="toggleSearch"
                                        class="absolute right-0 flex items-center gap-2 text-sm tracking-wider font-medium hover:text-gray-500 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none">
                                        <span class="hidden md:inline">Search</span>
                                        <i class="pi pi-search"></i>
                                    </button>

                                    <form v-show="isSearchExpanded" @submit.prevent="submitSearch"
                                        class="absolute right-0 flex items-center w-full transform origin-right transition-all duration-300">
                                        <div
                                            class="relative w-full flex items-center border-b border-gray-300 bg-white">
                                            <i class="pi pi-search text-gray-400 absolute left-0"></i>
                                            <input ref="searchInput" v-model="searchQuery" type="text"
                                                placeholder="Search artworks..."
                                                class="w-full py-2 pl-8 pr-8 border-none focus:ring-0 text-sm outline-none"
                                                @blur="closeSearch" />
                                            <button type="button" @mousedown.prevent="closeSearch"
                                                class="absolute right-0 hover:text-gray-500 curson-pointer">
                                                <i class="pi pi-times"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <Button id="user-menu-btn" severity="secondary" icon="pi pi-user"
                                    pt:icon:class="text-xl" text rounded aria-label="B2B Account"
                                    @mouseenter="showUserPopover" @mouseleave="hideUserPopover"
                                    @click="handleUserClick" />
                                <Link :href="route('cart.index')" class="cart-link flex items-center gap-1 text-xs"
                                    @mouseenter="showCartPopover" @mouseleave="hideCartPopover" aria-haspopup="true"
                                    aria-controls="cart-popover-content">

                                    <OverlayBadge v-if="cartCount > 0" :value="String(cartCount)">
                                        <Button id="cart-menu-btn" severity="secondary" icon="pi pi-shopping-cart"
                                            pt:icon:class="text-xl" text rounded aria-label="Cart menu" />
                                    </OverlayBadge>
                                    <Button v-else id="cart-menu-btn" severity="secondary" icon="pi pi-shopping-cart"
                                        pt:icon:class="text-xl" text rounded aria-label="Cart menu" />
                                </Link>
                                <Popover ref="op" target="#user-menu-btn" :showCloseIcon="false"
                                    @mouseenter="clearUserHideTimer" @mouseleave="hideUserPopover">
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

                                                <Link
                                                    :href="route('artwork.details', { id: item.artwork_id, slug: item.artwork_data?.slug })"
                                                    class="flex-shrink-0">
                                                    <img v-if="item.artwork_data?.img_thumb"
                                                        :src="item.artwork_data.img_thumb"
                                                        :alt="item.artwork_data.title"
                                                        class="w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity" />
                                                    <div v-else
                                                        class="w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0">
                                                        No Img
                                                    </div>
                                                </Link>

                                                <div class="cart-item-copy flex-grow min-w-0">
                                                    <Link
                                                        class="font-medium text-sm truncate hover:text-primary hover:underline transition-colors no-underline text-inherit"
                                                        :href="route('artwork.details', { id: item.artwork_id, slug: item.artwork_data?.slug })">
                                                        <p>
                                                            {{ item.artwork_data?.title || 'Untitled' }}
                                                        </p>
                                                    </Link>

                                                    <p class="text-sm text-muted-color">Type: {{ item.type }}</p>
                                                    <p class="text-sm text-muted-color">Print: {{ item.print_type ===
                                                        'oil' ? 'Oil Print' : 'Mono Print' }}</p>
                                                    <p class="text-sm text-muted-color">Frame: {{ item.frame }}</p>
                                                    <p class="text-sm text-muted-color">Size: {{ item.size }}</p>
                                                    <p class="text-sm text-muted-color">{{ item.quantity }} x &euro;{{
                                                        item.formattedPrice }}</p>
                                                    <p class="text-sm text-muted-color">{{ item.quantity }} x €{{
                                                        item.formattedPrice }}</p>
                                                </div>

                                                <Button icon="pi pi-times-circle" text rounded aria-label="Delete item"
                                                    @click="handleDeleteItem(item.id)" />
                                            </div>
                                            <div v-if="!isCartEmpty" class="mt-3 pt-2 dynamic-border">
                                                <p
                                                    class="cart-subtotal-line text-sm font-semibold flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>&euro;{{ cartSubtotal }}</span>
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
            <div class="h-[104px]"></div>

            <!-- Drawer Menu (now used for all screen sizes) -->
            <Drawer v-model:visible="mobileMenuOpen" position="left">
                <template #header>
                    <h3 class="font-bold text-xl">Menu</h3>
                </template>
                <div class="space-y-5">
                    <div class="flex flex-col gap-2">
                        <LinksPanelMenu :model="homeMobileMenuItems" class="w-full" />
                    </div>
                </div>
            </Drawer>

            <!-- Page Content -->
            <Toast position="top-center" />
            <main>
                <slot />
            </main>

            <Footer />
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

.header-locale-toggle span {
    font-size: 0;
}

.header-locale-toggle span::before {
    content: "English";
    font-size: 11px;
}

.cart-item-copy>p:last-child,
.cart-subtotal-line span:last-child {
    display: none;
}

.brand-link {
    letter-spacing: 0;
}

:deep(.art-main-menu .p-menubar-root-list) {
    gap: 2rem;
}

:deep(.art-main-menu .p-menubar-item-link) {
    background: transparent;
    color: #111827;
    font-size: 0.875rem;
    padding: 0;
}

:deep(.art-main-menu .p-menubar-item-link:hover) {
    background: transparent;
    color: #4b5563;
}

:deep(.art-main-menu .p-menubar-item-icon) {
    display: none;
}

:deep(.art-main-menu .p-menubar-end) {
    margin-left: auto;
}

:deep(.art-main-menu .p-menubar-start) {
    margin-right: 1.5rem;
}

/* Links inside header and popovers should not be blue or underlined */
:deep(nav a),
:deep(.p-popover a) {
    color: inherit;
    text-decoration: none !important;
}

/* Ensure hover states don't reintroduce underline or blue color */
:deep(nav a:hover),
:deep(.p-popover a:hover) {
    color: inherit;
    text-decoration: none !important;
}
</style>
