// resources/js/Pages/Dashboard/Orders/Index.vue
<template>
    <AdminLayout :title="'Orders'">
        <InertiaHead title="Admin - Orders" />
        <Container>
            <PageTitleSection title="Manage Orders" breadcrumbs="Dashboard > Orders" />

            <Card class="mt-6 mb-4">
                <template #content>
                    <form @submit.prevent="applyFilters">
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end mb-4">
                            <div>
                                <label for="start_date" class="block text-sm font-medium mb-1">From Date</label>
                                <DatePicker v-model="filterForm.start_date" dateFormat="yy-mm-dd" showIcon
                                    inputId="start_date" class="w-full" />
                            </div>
                            <div>
                                <label for="end_date" class="block text-sm font-medium mb-1">To Date</label>
                                <DatePicker v-model="filterForm.end_date" dateFormat="yy-mm-dd" showIcon
                                    inputId="end_date" class="w-full" />
                            </div>
                            <div class="flex space-x-2">
                                <Button type="submit" label="Filter" icon="pi pi-filter" />
                                <Button type="button" label="Clear" icon="pi pi-times" outlined @click="clearFilters" />
                            </div>
                            <div class="flex space-x-2 justify-start md:justify-end items-end">
                                <Button label="XLSX" icon="pi pi-file-excel" severity="success"
                                    @click="exportData('xlsx')" :loading="exporting === 'xlsx'" />
                                <Button label="PDF" icon="pi pi-file-pdf" severity="danger" @click="exportData('pdf')"
                                    :loading="exporting === 'pdf'" />
                            </div>
                        </div>
                        <small v-if="filterForm.errors.start_date" class="p-error">{{ filterForm.errors.start_date
                        }}</small>
                        <small v-if="filterForm.errors.end_date" class="p-error mt-1">{{ filterForm.errors.end_date
                        }}</small>
                    </form>
                    <DataTable :value="orders.data" responsiveLayout="scroll" stripedRows lazy :first="first" paginator
                        :rows="15" :totalRecords="orders.total" @page="onPage" :sortField="filters.sort"
                        :sortOrder="filters.direction === 'asc' ? 1 : -1" @sort="onSort">
                        <Column field="id" header="Order #" sortable>
                            <template #body="slotProps">
                                <Link :href="route('dashboard.orders.show', slotProps.data.id)"
                                    class="text-primary-500 no-underline hover:underline">
                                    {{ slotProps.data.id }} (<span class="text-gray-500 text-xs">{{
                                        slotProps.data.order_number }}</span>)
                                </Link>
                            </template>
                        </Column>
                        <Column field="customer_name" header="Customer" sortable />
                        <Column field="total_amount" header="Total" sortable>
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.total_amount) }}
                            </template>
                        </Column>
                        <Column field="print_on_material_value" header="Print Cost (15%)" sortable>
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.print_on_material_value) }}
                            </template>
                        </Column>
                        <Column field="status" header="Order Status" sortable>
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.status"
                                    :severity="getStatusSeverity(slotProps.data.status)" />
                            </template>
                        </Column>
                        <Column field="payment_status" header="Payment" sortable>
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
                        <ColumnGroup type="footer" v-if="orders.data && orders.data.length > 0">
                            <Row>
                                <Column :footer="`Total Orders on Page: ${orders.data.length}`" :colspan="2" />
                                <Column :footer="formatCurrency(pageTotalAmount)" />
                                <Column :footer="formatCurrency(pageTotalPrintOnMaterial)" />
                                <Column :colspan="4" />
                            </Row>
                        </ColumnGroup>
                        <!-- <template #footer v-if="orders.data && orders.data.length > 0">
                            <div class="grid grid-cols-8 font-bold p-2">
                                <div class="col-span-2">Total Orders on Page: {{ orders.data.length }}</div>
                                <div class="text-right">{{ formatCurrency(pageTotalAmount) }}</div>
                                <div class="text-right">{{ formatCurrency(pageTotalPrintOnMaterial) }}</div>
                                <div class="col-span-4"></div>
                            </div>
                        </template> -->
                    </DataTable>
                </template>
            </Card>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { Head as InertiaHead, Link, router, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import DatePicker from 'primevue/datepicker';
import { saveAs } from 'file-saver'; // For triggering download
import axios from 'axios'; // For making HTTP requests

const props = defineProps({
    orders: Object, // Paginated order data from controller
    filters: Object, // Applied filters (start_date, end_date)
});

const filterForm = useForm({
    start_date: props.filters?.start_date || null,
    end_date: props.filters?.end_date || null,
});

const exporting = ref(null); // To show loading state on export buttons: 'xlsx', 'pdf'

const applyFilters = () => {
    const filterData = {};
    if (filterForm.start_date) {
        // Format date to YYYY-MM-DD string if it's a Date object
        filterData.start_date = filterForm.start_date instanceof Date
            ? filterForm.start_date.toISOString().split('T')[0]
            : filterForm.start_date;
    }
    if (filterForm.end_date) {
        filterData.end_date = filterForm.end_date instanceof Date
            ? filterForm.end_date.toISOString().split('T')[0]
            : filterForm.end_date;
    }
    router.get(route('dashboard.orders.index'), filterData, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};

const clearFilters = () => {
    filterForm.reset(); // Reset form fields
    router.get(route('dashboard.orders.index'), {}, { // Navigate without filters
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};

const formatDateForSubmit = (dateValue) => {
    if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
    }
    return dateValue; // Assume already string or null
};

const exportData = async (format) => {
    exporting.value = format;
    const exportParams = {
        format: format,
        start_date: formatDateForSubmit(filterForm.start_date),
        end_date: formatDateForSubmit(filterForm.end_date),
    };

    try {
        const response = await axios.get(route('dashboard.orders.export'), {
            params: exportParams,
            responseType: 'blob',
        });
        const headerLine = response.headers['content-disposition'];
        let filename = 'export.' + format; // Default filename
        if (headerLine) {
            const filenameMatch = headerLine.match(/filename="?(.+?)"?$/);
            if (filenameMatch && filenameMatch.length === 2) {
                filename = filenameMatch[1];
            }
        }
        saveAs(response.data, filename);
    } catch (error) {
        console.error(`Error exporting ${format}:`, error);
        let errorMessage = `Export failed. Please try again.`;
        if (error.response && error.response.data) {
            if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorJson = JSON.parse(reader.result);
                        alert(`Export failed: ${errorJson.message || 'Server error details.'}`);
                    } catch (e) {
                        alert(errorMessage);
                    }
                };
                reader.readAsText(error.response.data);
                errorMessage = null; // Prevent default alert
            }
        }
        if (errorMessage) alert(errorMessage);
    } finally {
        exporting.value = null;
    }
};

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

const pageTotalAmount = computed(() => {
    return props.orders.data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
});

const pageTotalPrintOnMaterial = computed(() => {
    return props.orders.data.reduce((sum, order) => sum + parseFloat(order.print_on_material_value), 0);
});

const first = computed(() => {
    return (props.orders.current_page - 1) * props.orders.per_page;
});

// Handle lazy loading pagination with DataTable
const onPage = (event) => {
    router.get(route('dashboard.orders.index'), {
        page: event.page + 1, // PrimeVue pages are 0-indexed
        start_date: filterForm.start_date instanceof Date ? filterForm.start_date.toISOString().split('T')[0] : filterForm.start_date,
        end_date: filterForm.end_date instanceof Date ? filterForm.end_date.toISOString().split('T')[0] : filterForm.end_date,
    }, {
        preserveState: true,
        preserveScroll: false, // Usually scroll to top on page change
        replace: true,
    });
};

const onSort = (event) => {
    // 1. PrimeVue sends: 
    //    event.sortField (e.g., 'total_amount')
    //    event.sortOrder (1 for ASC, -1 for DESC)

    // 2. Map 1/-1 to 'asc'/'desc' for Laravel
    const newDirection = event.sortOrder === 1 ? 'asc' : 'desc';

    // 3. Reload page with new params
    router.get(route('dashboard.orders.index'), {
        // Keep existing search
        search: props.filters.search,

        // Apply new sort
        sort: event.sortField,
        direction: newDirection,

        // Reset to page 1 (Important! Sorting changes the order, so page 5 might not exist or be relevant anymore)
        page: 1,
    }, {
        preserveState: true,
        preserveScroll: true, // Feels like an instant table update
    });
};

</script>