<template>
    <HeaderLayout>
        <InertiaHead title="Admin - Orders" />
        <Container>
            <PageTitleSection title="Manage Orders" breadcrumbs="Dashboard > Orders" />

            <div class="mt-6">
                <Card>
                    <template #content>
                        <DataTable :value="orders.data" responsiveLayout="scroll" paginator :rows="15"
                            :totalRecords="orders.total">
                            <Column field="order_number" header="Order #" sortable>
                                <template #body="slotProps">
                                    <Link :href="route('dashboard.orders.show', slotProps.data.id)"
                                        class="text-primary-500 hover:underline">
                                    {{ slotProps.data.order_number }}
                                    </Link>
                                </template>
                            </Column>
                            <Column field="customer_name" header="Customer" sortable />
                            <Column field="customer_email" header="Email" sortable />
                            <Column field="total_amount" header="Total" sortable>
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.total_amount) }}
                                </template>
                            </Column>
                            <Column field="status" header="Order Status" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.status"
                                        :severity="getStatusSeverity(slotProps.data.status)" />
                                </template>
                            </Column>
                            <Column field="payment_status" header="Payment Status" sortable>
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.payment_status"
                                        :severity="getPaymentStatusSeverity(slotProps.data.payment_status)" />
                                </template>
                            </Column>
                            <Column field="created_at" header="Date" sortable>
                                <template #body="slotProps">
                                    {{ formatDate(slotProps.data.created_at) }}
                                </template>
                            </Column>
                            <Column header="Actions">
                                <template #body="slotProps">
                                    <Link :href="route('dashboard.orders.show', slotProps.data.id)">
                                    <Button icon="pi pi-eye" class="p-button-sm p-button-text" />
                                    </Link>
                                </template>
                            </Column>
                        </DataTable>
                        <div v-if="orders.links.length > 3" class="mt-4 flex justify-center space-x-1">
                            <Link v-for="(link, k) in orders.links" :key="k" class="px-3 py-2 text-sm rounded-md"
                                :class="{ 'bg-primary-500 text-white': link.active, 'hover:bg-gray-200 dark:hover:bg-gray-700': !link.active, 'text-gray-500 cursor-default': !link.url }"
                                :href="link.url" v-html="link.label" :disabled="!link.url" />
                        </div>
                    </template>
                </Card>
            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { defineProps } from 'vue';
import { Head as InertiaHead, Link } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue'; // Assuming a global admin layout or use your DashboardLayout
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const props = defineProps({
    orders: Object, // Paginated order data
});

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const formatCurrency = (value) => {
    if (typeof value !== 'number') value = parseFloat(value);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value); // Adjust currency as needed
};

const getStatusSeverity = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'delivered' || s === 'shipped') return 'success';
    if (s === 'pending' || s === 'processing') return 'warning';
    if (s === 'cancelled' || s === 'refunded') return 'danger';
    return 'info';
};

const getPaymentStatusSeverity = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return 'success';
    if (s === 'pending') return 'warning';
    if (s === 'failed' || s === 'refunded') return 'danger';
    return 'info';
};
</script>