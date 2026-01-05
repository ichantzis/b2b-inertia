<template>
    <UserLayout>

        <Head :title="`Order #${order.order_number}`" />

        <Link :href="route('account.orders.index')" class="text-gray-500 hover:text-gray-800 transition-colors">
            <i class="pi pi-arrow-left text-xl"></i>
        </Link>
        <div class="main-content">
            <div class="content-wrapper">
                <div class="card p-6 md:p-8">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
                        <div class="mb-4 sm:mb-0">
                            <span class="font-medium text-xl text-surface-900 dark:text-surface-0 mr-2">Order
                                number:</span>
                            <span class="font-medium text-xl text-primary-500">{{ order.order_number }}</span>
                            <div class="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <span>{{ order.created_at }}</span>
                                <span>•</span>
                                <Tag :value="order.status.toUpperCase()"
                                    :severity="getPaymentStatusSeverity(order.status)" class="text-xs" />
                            </div>

                        </div>
                        <div>
                            <Button label="Print" icon="pi pi-print" outlined @click="printOrder" />
                        </div>
                    </div>

                    <div class="rounded border-surface-200 dark:border-surface-700 border">
                        <ul class="list-none p-0 m-0">
                            <li v-for="item in orderItems" :key="item.id"
                                class="p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center border-b last:border-b-0">
                                <img :src="item.img_thumb"
                                    class="w-12 h-12 sm:w-24 sm:h-24 object-contain flex-shrink-0 mr-4 shadow-md"
                                    :alt="item.title || 'Artwork image'">
                                <div class="flex flex-col flex-grow">
                                    <span
                                        class="text-surface-900 dark:text-surface-0 font-semibold text-lg sm:text-xl mb-1">{{
                                            item.title || item.artwork_data.title }}</span>
                                    <span class="text-surface-700 dark:text-surface-100 font-medium text-sm mb-2">
                                        Type: {{ item.type || 'N/A' }} | Size: {{
                                            item.size || 'N/A' }} | Frame: {{ item.frame ||
                                            'N/A' }}
                                    </span>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium text-sm">Quantity:
                                        {{ item.quantity }}</span>
                                </div>
                                <span
                                    class="text-surface-900 dark:text-surface-0 font-medium text-base sm:text-lg ml-auto">{{
                                        formatCurrency(item.price * item.quantity) }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-6 mt-8 pb-4">
                        <div class="w-full lg:w-1/2 space-y-6">
                            <div>
                                <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3">Billing
                                    Address</h3>
                                <div class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1">
                                    <span>{{ order.billing_first_name }} {{ order.billing_last_name }}</span>
                                    <span>{{ order.billing_address }}</span>
                                    <span>{{ order.billing_city }}, {{ order.billing_state_or_county }} {{
                                        order.billing_postal_code }}</span>
                                    <span>{{ order.billing_country_name }}</span>
                                    <span>{{ order.billing_email }}</span>
                                    <span v-if="order.billing_phone">Phone: {{ order.billing_phone }}</span>
                                </div>
                            </div>

                            <div>
                                <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3">
                                    {{ order.shipping_is_different ? 'Shipping Address' : 'Shipping (Same as Billing)'
                                    }}
                                </h3>
                                <div v-if="order.shipping_is_different"
                                    class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1">
                                    <span>{{ order.shipping_first_name }} {{ order.shipping_last_name }}</span>
                                    <span>{{ order.shipping_address }}</span>
                                    <span>{{ order.shipping_city }}, {{ order.shipping_state_or_county }} {{
                                        order.shipping_postal_code }}</span>
                                    <span>{{ order.shipping_country_name }}</span>
                                    <span v-if="order.shipping_phone">Phone: {{ order.shipping_phone }}</span>
                                    <span
                                        v-if="order.shipping_email && order.shipping_email !== order.billing_email">Email:
                                        {{ order.shipping_email }}</span>
                                </div>
                                <div v-else class="text-surface-700 dark:text-surface-200 italic">
                                    Shipping address is the same as billing address.
                                </div>
                            </div>

                            <div v-if="order.wants_invoice">
                                <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mt-4 mb-3">
                                    Invoice Details</h3>
                                <div class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1">
                                    <span v-if="order.invoice_company_name">Company: {{ order.invoice_company_name
                                        }}</span>
                                    <span v-if="order.invoice_vat_number">VAT: {{ order.invoice_vat_number }}</span>
                                    <span v-if="order.invoice_profession">Profession: {{ order.invoice_profession
                                        }}</span>
                                    <span v-if="order.invoice_tax_office">Tax Office: {{ order.invoice_tax_office
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="w-full lg:w-1/2 space-y-6">

                            <div>
                                <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3">Payment
                                </h3>
                                <div class="flex items-center">
                                    <i :class="getPaymentMethodIcon(order.payment_method)"
                                        class="mr-2 text-2xl text-surface-700 dark:text-surface-200"></i>
                                    <div class="flex flex-col">
                                        <span class="text-surface-700 dark:text-surface-200 mb-1">{{
                                            getPaymentMethodLabel(order.payment_method) }}</span>
                                        <span v-if="order.payment_method === 'stripe'"
                                            class="text-surface-700 dark:text-surface-200 font-medium">**** ****
                                            **** {{ order.card_last_four || 'XXXX' }}</span>
                                        <span class="text-sm capitalize">Status: <Tag :value="order.payment_status"
                                                :severity="getPaymentStatusSeverity(order.payment_status)"></Tag>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6">
                                <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3">Summary
                                </h3>
                                <ul class="list-none p-0 m-0 w-full">
                                    <li class="flex justify-between mb-2">
                                        <span class="text-surface-700 dark:text-surface-200">Subtotal</span>
                                        <span class="text-surface-700 dark:text-surface-200 font-medium text-base">{{
                                            formatCurrency(subtotal) }}</span>
                                    </li>
                                    <li class="flex justify-between mb-2">
                                        <span class="text-surface-700 dark:text-surface-200">Shipping</span>
                                        <span class="text-surface-700 dark:text-surface-200 font-medium text-base">{{
                                            formatCurrency(shippingCost) }}</span>
                                    </li>
                                    <li v-if="order.discount_amount > 0" class="flex justify-between text-green-600 font-medium">
                                            <span>
                                            Discount 
                                            <span v-if="order.coupon_code" class="text-xs ml-1 bg-green-100 px-2 py-0.5 rounded text-green-700">
                                                {{ order.coupon_code }}
                                            </span>
                                            </span>
                                            <span>-{{ formatCurrency(order.discount_amount) }}</span>
                                        </li>
                                    <li
                                        class="flex justify-between border-t border-surface-200 dark:border-surface-700 pt-3 mt-2">
                                        <span
                                            class="text-surface-900 dark:text-surface-0 font-semibold text-lg">Total</span>
                                        <span class="text-surface-900 dark:text-surface-0 font-bold text-xl">{{
                                            formatCurrency(order.total) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-if="order.notes" class="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700">
                        <h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-2">Order Notes</h3>
                        <p class="text-surface-700 dark:text-surface-200">{{ order.notes }}</p>
                    </div>
                </div>
            </div>
        </div>
    </UserLayout>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import UserLayout from '@/layouts/UserLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

const props = defineProps({
    order: Object
});

console.log('Order:', props.order); // Debugging line to check order data


const showFullDetails = ref(false); // For a potential details toggle

const toggleDetails = () => {
    showFullDetails.value = !showFullDetails.value;
    // You might want to make the items list collapsible or something similar
    // For now, this button doesn't do much other than toggle a ref
};

const printOrder = () => {
    window.print();
};

const orderItems = computed(() => {
    return props.order?.items || []; // Added safe navigation
});

// Helper to convert country code to country name (you'll need a more comprehensive list or a library)
const europeanCountries = { AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czech Republic', DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden', /* Add other relevant countries */ };

const getCountryName = (code) => {
    return europeanCountries[code] || code; // Fallback to code if name not found
};

// Add these computed properties to display country names
const billingCountryName = computed(() => getCountryName(props.order?.billing_country));
const shippingCountryName = computed(() => getCountryName(props.order?.shipping_country));


const subtotal = computed(() => {
    let total = 0;
    if (orderItems.value) {
        orderItems.value.forEach(item => {
            total += parseFloat(item.price) * parseInt(item.quantity);
        });
    }
    return total;
});

const shippingCost = computed(() => {
    // Replace with your actual shipping cost logic or data if available from order
    return props.order?.shipping_cost || 0; // Assuming you might add shipping_cost to order
});

// const tax = computed(() => { ... }); // Keep if you have tax

function formatCurrency(value) {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value); // Example: German locale for EUR
}

function getPaymentMethodIcon(method) {
    switch (method) {
        case 'stripe': return 'pi pi-credit-card';
        case 'cod': return 'pi pi-wallet';
        case 'bank_transfer': return 'pi pi-bank';
        default: return 'pi pi-question-circle';
    }
}

function getPaymentMethodLabel(method) {
    const labels = {
        stripe: 'Credit/Debit Card (Stripe)',
        cod: 'Cash On Delivery',
        bank_transfer: 'Bank Transfer'
    };
    return labels[method] || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getPaymentStatusSeverity(status) {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'failed':
        case 'cancelled':
            return 'danger';
        default:
            return 'info';
    }
}
</script>

<style scoped>
/* Original styles - might need slight adjustments for the new layout */
.main-content {
    flex: 1;
    padding: 1rem 0;
    /* Adjusted padding */
}

.content-wrapper {
    margin: 0 auto;
    background: var(--p-content-background);
    /* PrimeVue variable */
    color: var(--p-text-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-card-shadow);
    /* padding: 2rem; /* Consider removing if card has padding */
}

.card {
    /* If using PrimeVue Card, it has its own padding. If this is a custom div, add padding. */
    /* For PrimeVue card, use pt to style content if needed: :pt="{ content: { class: 'p-6 md:p-8' } }" */
}

.list-none {
    list-style: none;
}

.p-0 {
    padding: 0;
}

.m-0 {
    margin: 0;
}

.border-bottom-1 {
    border-bottom-width: 1px;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.mr-4 {
    margin-right: 1rem;
}

.shadow-md {
    /* More subtle shadow for item images */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.text-primary-500 {
    color: var(--p-primary-500);
    /* PrimeVue variable */
}

/* Enhanced Address Block Styling */
.text-surface-700 {
    color: var(--p-text-secondary-color);
}

.dark .text-surface-100 {
    /* Adjust for dark mode if needed */
}

.dark .text-surface-200 {}

.text-surface-900 {
    color: var(--p-text-color);
}

.dark .text-surface-0 {
    /* Adjust for dark mode */
}

.space-y-1>*+* {
    margin-top: 0.25rem;
}

.space-y-6>*+* {
    margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {

    /* sm breakpoint */
    .main-content {
        padding: 1rem;
    }

    .content-wrapper {
        /* padding: 1rem; */
        /* If using custom card div */
    }

    .card {
        /* padding: 1rem; */
        /* If custom */
    }

    .order-items-grid img {
        /* If you use this class */
        width: 4rem;
        /* Smaller images on mobile */
        height: 4rem;
    }
}
</style>