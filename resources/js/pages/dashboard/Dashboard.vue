<template>
    <AdminLayout>
        <InertiaHead title="Dashboard" />
        <Container>
            <PageTitleSection title="Dashboard" />

            <div class="grid grid-cols-12 gap-8 pt-4">
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <Link :href="route('dashboard.orders.index')" class="no-underline">
                    <div class="card mb-0 hover:shadow-sm">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Orders</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ orderCount }}
                                </div>
                            </div>
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ newOrders }} new </span>
                        <span class="text-muted-color">since last visit</span>
                    </div>
                    </Link>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <Link class="no-underline">
                    <div class="card mb-0 hover:shadow-sm">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Revenue</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">${{ revenue }}
                                </div>
                            </div>
                            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">%{{ revenueChange }}+ </span>
                        <span class="text-muted-color">since last week</span>
                    </div>
                    </Link>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <Link class="no-underline">
                    <div class="card mb-0 hover:shadow-sm">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Customers</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ customerCount
                                }}</div>
                            </div>
                            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-users text-cyan-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ newCustomers }} </span>
                        <span class="text-muted-color"> newly registered</span>
                    </div>
                    </Link>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <Link class="no-underline">
                    <div class="card mb-0 hover:shadow-sm">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Comments</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ unreadComments
                                }} Unread</div>
                            </div>
                            <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
                                style="width:2.5rem;height:2.5rem;">
                                <i class="pi pi-comment text-purple-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ respondedComments }} </span>
                        <span class="text-muted-color">responded</span>
                    </div>
                    </Link>
                </div>

                <div class="col-span-12">
                    <div class="card">
                        <div class="font-semibold text-xl mb-4">Recent Sales</div>
                        <DataTable :value="recentOrders" responsiveLayout="scroll">
                            <Column field="order_number" header="Order No">
                                <template #body="slotProps">
                                    <Link :href="route('dashboard.orders.show', slotProps.data.id)"
                                        class="text-primary-500 hover:text-primary-600 no-underline">
                                    {{ slotProps.data.order_number }}
                                    </Link>
                                </template>
                            </Column>
                            <Column field="name" header="Name" sortable />
                            <Column field="date" header="Date" sortable />
                            <Column field="status" header="Status" sortable />
                            <Column field="price" header="Price" sortable />
                            <Column header="View">
                                <template #body>
                                    <Button icon="pi pi-search" rounded text />
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
import { ref, onMounted, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import moment from 'moment';
// import Chart from 'chart.js/auto'; 

const props = defineProps({
    recentOrders: Array, // Define the recentSales prop
    orderCount: Number,
    newOrders: Number,
    customerCount: Number,
    newCustomers: Number,
});

// Dummy Data - Replace with your actual data fetching logic
const orderCount = computed(() => props.orderCount);
const newOrders = computed(() => props.newOrders);
const revenue = ref(2100);
const revenueChange = ref(52);
const customerCount = computed(() => props.customerCount);
const newCustomers = computed(() => props.newCustomers);
const unreadComments = ref(152);
const respondedComments = ref(85);

const recentOrders = computed(() => {
    return props.recentOrders.map(order => ({
        ...order,
        name: order.customer_name,
        date: formatDate(order.created_at),
        status: order.status,
        price: order.total_amount,
    }));
});

const bestSellingProducts = ref([
    { name: 'Space T-Shirt', category: 'Clothing', percentage: '50%', color: 'orange' },
    { name: 'Portal Sticker', category: 'Accessories', percentage: '16%', color: 'cyan' },
    { name: 'Supernova Sticker', category: 'Accessories', percentage: '67%', color: 'pink' },
    { name: 'Wonders Notebook', category: 'Office', percentage: '35%', color: 'green' },
    { name: 'Mat Black Case', category: 'Accessories', percentage: '75%', color: 'purple' },
    { name: 'Robots T-Shirt', category: 'Clothing', percentage: '40%', color: 'teal' },
]);

const revenueChart = ref(null);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const viewOrderDetails = (order) => {
    // Implement your logic to view order details (e.g., navigate to an order details page)
    console.log('Viewing order details:', order);
    // Example using Inertia router:
    // router.get(route('order.details', { orderId: order.id }));
};

onMounted(() => {
    // createRevenueChart();
});

const createRevenueChart = () => {
    const ctx = revenueChart.value.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Revenue',
                data: [65, 59, 80, 81, 56, 55, 40], // Replace with your revenue data
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

</script>

<style scoped>
.card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}

.text-muted-color {
    color: var(--p-text-color);
    opacity: 0.6;
}

.rounded-border {
    border-radius: 50%;
}

.layout-main {
    padding: 1rem;
}
</style>