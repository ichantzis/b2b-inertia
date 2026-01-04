<template>
    <UserLayout>

        <Head title="My Orders" />

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-800">Order History</h2>
            </div>

            <div v-if="orders.data.length === 0" class="p-16 text-center">
                <i class="pi pi-shopping-bag text-4xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                <p class="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                <Link href="/" class="text-indigo-600 font-medium hover:underline">Start Browsing</Link>
            </div>

            <div v-else>
                <Link v-for="order in orders.data" :key="order.id" :href="route('account.orders.show', order.order_number)"
                    class="block p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group no-underline">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <div class="flex items-center gap-3 mb-1">
                                <span class="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    Order #{{ order.order_number }}
                                </span>
                                <Tag :value="order.status.toUpperCase()" :severity="getStatusSeverity(order.status)"
                                    class="text-xs" />
                            </div>
                            <div class="text-sm text-gray-500">Placed on {{ order.date }}</div>
                        </div>

                        <div class="flex items-center gap-4 text-right">
                            <div>
                                <div class="font-bold text-lg text-gray-900">{{ order.total_formatted }}</div>
                                <div class="text-xs text-gray-500">{{ order.item_count }} items</div>
                            </div>
                            <i class="pi pi-chevron-right text-gray-300 group-hover:text-indigo-400"></i>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <div v-for="(item, idx) in order.preview_items" :key="idx"
                            class="w-12 h-12 rounded bg-gray-100  overflow-hidden">
                            <img :src="item.thumb" class="w-full h-full object-cover" :alt="item.title">
                        </div>
                        <div v-if="order.item_count > 3"
                            class="w-12 h-12 rounded bg-gray-50 border flex items-center justify-center text-xs text-gray-500 font-medium">
                            +{{ order.item_count - 3 }}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    </UserLayout>
</template>

<script setup>
import UserLayout from '@/layouts/UserLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import Tag from 'primevue/tag';

defineProps({ orders: Object });

const getStatusSeverity = (status) => {
    switch (status) {
        case 'completed': return 'success';
        case 'processing': return 'info';
        case 'pending': return 'warn';
        case 'cancelled': return 'danger';
        default: return 'info';
    }
};
</script>