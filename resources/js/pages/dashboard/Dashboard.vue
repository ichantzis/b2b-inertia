<template>
    <AdminLayout>
        <InertiaHead title="Dashboard" />
        <Container>
            <PageTitleSection title="Dashboard Overview" />

            <div class="grid grid-cols-12 gap-6 pt-4">
                <div class="col-span-12 md:col-span-6 xl:col-span-3">
                    <Link :href="route('dashboard.orders.index')" class="no-underline block h-full">
                        <div class="card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                            <div class="flex justify-between mb-3">
                                <div>
                                    <span class="block text-muted-color font-medium mb-3">Orders</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{ orderCount
                                    }}</div>
                                </div>
                                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full"
                                    style="width:2.5rem;height:2.5rem;">
                                    <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                                </div>
                            </div>
                            <span class="text-primary font-medium">{{ newOrders }} new </span>
                            <span class="text-muted-color text-sm">since last week</span>
                        </div>
                    </Link>
                </div>

                <div class="col-span-12 md:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full flex flex-col justify-between">
                        <div class="flex justify-between mb-3">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">Revenue ({{ quarterLabel
                                    }})</span>
                                <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">€{{
                                    formatCurrency(revenue) }}</div>
                            </div>
                            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                            </div>
                        </div>

                        <div>
                            <span :class="revenueChange >= 0 ? 'text-green-500' : 'text-red-500'" class="font-medium">
                                {{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange }}%
                            </span>
                            <span class="text-muted-color text-sm"> vs last quarter</span>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 xl:col-span-3">
                    <Link :href="route('dashboard.users.index')" class="no-underline block h-full">
                        <div class="card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                            <div class="flex justify-between mb-3">
                                <div>
                                    <span class="block text-muted-color font-medium mb-3">Customers</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">{{
                                        customerCount }}</div>
                                </div>
                                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full"
                                    style="width:2.5rem;height:2.5rem;">
                                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                                </div>
                            </div>
                            <span class="text-primary font-medium">{{ newCustomers }} </span>
                            <span class="text-muted-color text-sm">newly registered</span>
                        </div>
                    </Link>
                </div>

                <div class="col-span-12 md:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full flex flex-col justify-between">
                        <div class="flex justify-between mb-3">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">Avg. Order Value</span>
                                <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">€{{
                                    formatCurrency(averageOrderValue) }}</div>
                            </div>
                            <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-wallet text-green-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-muted-color text-sm">Average spend per order</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6 pt-6">
                <div class="col-span-12 xl:col-span-8">
                    <div class="card h-full">
                        <div class="font-semibold text-xl mb-4">Revenue Overview</div>
                        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[20rem]" />
                    </div>
                </div>

                <div class="col-span-12 xl:col-span-4 flex flex-col gap-6">

                    <div class="card flex-1">
                        <div class="font-semibold text-lg mb-3">Best Selling Frames</div>
                        <DataTable :value="topFrames" :rows="5" responsiveLayout="scroll" size="small">
                            <Column field="frame" header="Color/Type"></Column>
                            <Column field="total_sold" header="Sold" class="flex text-right justify-end">
                                <template #body="slotProps">
                                    <span class="font-bold text-surface-700 dark:text-white/80">{{
                                        slotProps.data.total_sold }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div class="card flex-1">
                        <div class="font-semibold text-lg mb-3">Best Selling Sizes</div>
                        <DataTable :value="topSizes" :rows="5" responsiveLayout="scroll" size="small">
                            <Column field="size" header="Dimension"></Column>
                            <Column field="total_sold" header="Sold" class="flex text-right justify-end">
                                <template #body="slotProps">
                                    <span class="font-bold text-surface-700 dark:text-white/80">{{
                                        slotProps.data.total_sold }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                </div>
            </div>

            <div class="grid grid-cols-12 gap-6 pt-6">
                <div class="col-span-12">
                    <div class="card">
                        <div class="flex justify-between items-center mb-4">
                            <div class="font-semibold text-xl">Recent Orders</div>
                            <Link :href="route('dashboard.orders.index')">
                                <Button label="View All" icon="pi pi-arrow-right" iconPos="right" text size="small" />
                            </Link>
                        </div>
                        <DataTable :value="recentOrdersFormatted" responsiveLayout="scroll" size="small">
                            <Column field="order_number" header="Order No">
                                <template #body="slotProps">
                                    <Link :href="route('dashboard.orders.show', slotProps.data.id)"
                                        class="font-medium text-primary hover:underline decoration-1">
                                        {{ slotProps.data.order_number }}
                                    </Link>
                                </template>
                            </Column>
                            <Column field="name" header="Customer" />
                            <Column field="date" header="Date" />
                            <Column field="status" header="Status">
                                <template #body="slotProps">
                                    <span :class="getStatusBadge(slotProps.data.status)">
                                        {{ slotProps.data.status }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="price" header="Total">
                                <template #body="slotProps">
                                    €{{ slotProps.data.price }}
                                </template>
                            </Column>
                            <Column style="width: 4rem">
                                <template #body="slotProps">
                                    <Link :href="route('dashboard.orders.show', slotProps.data.id)">
                                        <Button icon="pi pi-search" rounded text severity="secondary" />
                                    </Link>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { Head as InertiaHead, Link } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Chart from 'primevue/chart'; // Import Chart Component

const props = defineProps({
    recentOrders: Array,
    orderCount: Number,
    newOrders: Number,
    revenue: Number, // Total revenue passed from backend
    revenueChange: Number,
    quarterLabel: String,
    customerCount: Number,
    newCustomers: Number,
    topFrames: Array,
    topSizes: Array,
    salesChartData: Array, // Array of {date: '...', total: ...}
    averageOrderValue: Number,
});

// Formatting Helpers
const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusBadge = (status) => {
    // Simple classes for status colors. You can move this to CSS or a component
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase';
        case 'pending': return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold uppercase';
        case 'cancelled': return 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase';
        default: return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase';
    }
};

// Recent Orders Computed
const recentOrdersFormatted = computed(() => {
    return props.recentOrders.map(order => ({
        ...order,
        name: order.customer_name,
        date: formatDate(order.created_at),
        status: order.status,
        price: order.total_amount,
    }));
});

// Chart Configuration
const chartData = computed(() => {
    const labels = props.salesChartData.map(d => new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
    const data = props.salesChartData.map(d => d.total);

    return {
        labels: labels,
        datasets: [
            {
                label: 'Daily Revenue (€)',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue-500 with opacity
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }
        ]
    };
});

const chartOptions = ref({
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    },
    maintainAspectRatio: false
});

</script>

<style scoped>
.card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.text-muted-color {
    color: #64748b;
}
</style>