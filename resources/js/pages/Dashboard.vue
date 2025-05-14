<template>
    <HeaderLayout>
        <InertiaHead title="Dashboard" />
        <Container>
            <PageTitleSection title="Dashboard" />

            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
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
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
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
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
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
                        <span class="text-muted-color">newly registered</span>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
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
                </div>

                <div class="col-span-12">
                    <div class="card">
                        <div class="font-semibold text-xl mb-4">Recent Sales</div>
                        <DataTable :value="recentOrders" responsiveLayout="scroll">
                            <Column field="order_number" header="Order No" />
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

                <!-- <div class="col-span-12 xl:col-span-6">
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <div class="font-semibold text-xl">Best Selling Products</div>
                            <div>
                                <Button icon="pi pi-ellipsis-v" rounded text plain />
                            </div>
                        </div>
                        <ul class="list-none p-0 m-0">
                            <li v-for="product in bestSellingProducts" :key="product.name"
                                class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{
                                        product.name
                                    }}</span>
                                    <div class="mt-1 text-muted-color">{{ product.category }}</div>
                                </div>
                                <div class="mt-2 md:mt-0 flex items-center">
                                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24"
                                        style="height:8px;">
                                        <div class="bg-orange-500 h-full" :style="{ width: product.percentage }"></div>
                                    </div>
                                    <span :class="`text-${product.color}-500 ml - 4 font - medium`">{{
                                        product.percentage
                                        }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div> -->

                <!-- <div class="col-span-12 xl:col-span-6">
                    <div class="card">
                        <div class="font-semibold text-xl mb-4">Revenue Stream</div>
                        <div class="p-chart h-80" style="position: relative;">
                            <canvas ref="revenueChart"></canvas>
                        </div>
                    </div>
                </div> -->

                <!-- <div class="col-span-12 xl:col-span-6">
                    <div class="card">
                        <div class="flex items-center justify-between mb-6">
                            <div class="font-semibold text-xl">Notifications</div>
                            <div>
                                <Button icon="pi pi-ellipsis-v" rounded text plain />
                            </div>
                        </div>
                        <span class="block text-muted-color font-medium mb-4">TODAY</span>
                        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                            <li class="flex items-center py-2 border-b border-surface">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-dollar !text-xl text-blue-500"></i>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 leading-normal">Richard Jones <span
                                        class="text-surface-700 dark:text-surface-100">has purchased a blue t-shirt for
                                        <span class="text-primary font-bold">$79.00</span></span></span>
                            </li>
                            <li class="flex items-center py-2">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-download !text-xl text-orange-500"></i>
                                </div>
                                <span class="text-surface-700 dark:text-surface-100 leading-normal">Your request for
                                    withdrawal of <span class="text-primary font-bold">$2500.00</span> has been
                                    initiated.</span>
                            </li>
                        </ul>
                        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
                        <ul class="p-0 m-0 list-none mb-6">
                            <li class="flex items-center py-2 border-b border-surface">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-dollar !text-xl text-blue-500"></i>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 leading-normal">Keyser Wick <span
                                        class="text-surface-700 dark:text-surface-100">has purchased a black jacket for
                                        <span class="text-primary font-bold">$59.00</span></span></span>
                            </li>
                            <li class="flex items-center py-2 border-b border-surface">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-question !text-xl text-pink-500"></i>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 leading-normal">Jane Davis <span
                                        class="text-surface-700 dark:text-surface-100">has posted a new questions about
                                        your
                                        product.</span></span>
                            </li>
                        </ul>
                        <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
                        <ul class="p-0 m-0 list-none">
                            <li class="flex items-center py-2 border-b border-surface">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-arrow-up !text-xl text-green-500"></i>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 leading-normal">Your revenue has
                                    increased by <span class="text-primary font-bold">%25</span>.</span>
                            </li>
                            <li class="flex items-center py-2 border-b border-surface">
                                <div
                                    class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                                    <i class="pi pi-heart !text-xl text-purple-500"></i>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 leading-normal"><span
                                        class="text-primary font-bold">12</span> users have added your products to their
                                    wishlist.</span>
                            </li>
                        </ul>
                    </div>
                </div> -->
            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import moment from 'moment';
// import Chart from 'chart.js/auto'; 

const props = defineProps({
    recentOrders: Array, // Define the recentSales prop
});

// Dummy Data - Replace with your actual data fetching logic
const orderCount = ref(152);
const newOrders = ref(24);
const revenue = ref(2100);
const revenueChange = ref(52);
const customerCount = ref(28441);
const newCustomers = ref(520);
const unreadComments = ref(152);
const respondedComments = ref(85);

const recentOrders = computed(() => {
    return props.recentOrders.map(order => ({
        ...order,
        name: order.shipping_first_name + ' ' + order.shipping_last_name,
        date: formatDate(order.created_at),
        status: order.status,
        price: order.total_amount,
    }));
});
console.log(recentOrders);


const bestSellingProducts = ref([
    { name: 'Space T-Shirt', category: 'Clothing', percentage: '50%', color: 'orange' },
    { name: 'Portal Sticker', category: 'Accessories', percentage: '16%', color: 'cyan' },
    { name: 'Supernova Sticker', category: 'Accessories', percentage: '67%', color: 'pink' },
    { name: 'Wonders Notebook', category: 'Office', percentage: '35%', color: 'green' },
    { name: 'Mat Black Case', category: 'Accessories', percentage: '75%', color: 'purple' },
    { name: 'Robots T-Shirt', category: 'Clothing', percentage: '40%', color: 'teal' },
]);

const revenueChart = ref(null);

const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
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