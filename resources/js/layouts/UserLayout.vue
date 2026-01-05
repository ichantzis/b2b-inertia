<template>
    <HeaderLayout>
        <div class="bg-gray-50 min-h-screen py-10">
            <div class="container mx-auto px-4">
                <div class="flex flex-col lg:flex-row gap-8">
                    
                    <aside class="w-full lg:w-72 flex-shrink-0">
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div class="p-6 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {{ $page.props.auth.user.name.charAt(0).toUpperCase() }}
                                    </div>
                                    <div class="overflow-hidden">
                                        <div class="font-bold text-gray-900 truncate">{{ $page.props.auth.user.name }}</div>
                                        <div class="text-xs text-gray-500 truncate">{{ $page.props.auth.user.email }}</div>
                                    </div>
                                </div>
                            </div>

                            <nav class="p-2 space-y-1">
                                <Link :href="route('account.orders.index')" 
                                      class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline"
                                      :class="$page.url.startsWith('/account/orders') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                    <i class="pi pi-shopping-bag mr-3 text-lg" :class="$page.url.startsWith('/account/orders') ? 'text-indigo-600' : 'text-gray-400'"></i>
                                    My Orders
                                </Link>

                                <!-- <Link :href="route('account.addresses.index')" 
                                      class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline"
                                      :class="$page.url.startsWith('/account/addresses') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                    <i class="pi pi-map-marker mr-3 text-lg" :class="$page.url.startsWith('/account/addresses') ? 'text-indigo-600' : 'text-gray-400'"></i>
                                    Addresses
                                </Link> -->

                                <Link :href="route('account.profile.edit')" 
                                      class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline"
                                      :class="$page.url.startsWith('/account/profile') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                    <i class="pi pi-user mr-3 text-lg" :class="$page.url.startsWith('/account/profile') ? 'text-indigo-600' : 'text-gray-400'"></i>
                                    Profile Details
                                </Link>

                                <div class="my-2 border-t border-gray-100 mx-2"></div>

                                <button @click="logout" class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer">
                                    <i class="pi pi-sign-out mr-3 text-lg text-red-500"></i>
                                    Log Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <main class="flex-1">
                        <slot />
                    </main>
                </div>
            </div>
        </div>
    </HeaderLayout>
</template>

<script setup>
import HeaderLayout from '@/layouts/HeaderLayout.vue'; // Using your existing layout
import { Link, router } from '@inertiajs/vue3';

const logout = () => {
    router.post(route('logout'));
};
</script>