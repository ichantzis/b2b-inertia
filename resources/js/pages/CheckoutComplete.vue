<template>
    <HeaderLayout>

        <Head title="Order Complete" />
        <Container>
            <PageTitleSection title="Order Complete" />

            <div class="content-wrapper">
                <div class="card">
                    <span class="text-surface-700 dark:text-surface-100 text-xl">Thanks!</span>
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl my-2">Successful Order!</div>
                    <p class="text-surface-700 dark:text-surface-100 text-xl mt-0 mb-6 p-0">Your order is on the way.
                        We'll inform you.</p>
                    <div
                        style="height: 3px; background: linear-gradient(90deg, var(--primary-color) 0%, rgba(33, 150, 243, 0) 50%);">
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
                        <div class="mb-4 sm:mb-0">
                            <span class="font-medium text-xl text-surface-900 dark:text-surface-0 mr-2">Order
                                number:</span>
                            <span class="font-medium text-xl text-blue-500">{{ order.order_number }}</span>
                        </div>
                        <div>
                            <button class="p-button p-component p-button-outlined mr-2" type="button"
                                aria-label="Details">
                                <span class="p-button-icon p-button-icon-left pi pi-list"></span>
                                <span class="p-button-label">Details</span>
                            </button>
                            <button class="p-button p-component p-button-outlined" type="button" aria-label="Print">
                                <span class="p-button-icon p-button-icon-left pi pi-print"></span>
                                <span class="p-button-label">Print</span>
                            </button>
                        </div>
                    </div>
                    <div class="rounded border-surface-200 dark:border-surface-700 border">
                        <ul class="list-none p-0 m-0">
                            <li v-for="item in orderItems" :key="item.id"
                                class="p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center border-bottom-1">
                                <img :src="item.artwork_data.img_thumb" class="w-12 sm:w-32 flex-shrink-0 mr-4 shadow"
                                    :alt="item.artwork_data.title">
                                <div class="flex flex-col">
                                    <span class="text-surface-900 dark:text-surface-0 font-semibold text-xl mb-2">{{
                                        item.artwork_data.title }}</span>
                                    <span class="text-surface-700 dark:text-surface-100 font-medium mb-4">{{ item.type
                                        }} | {{ item.size }}</span>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium">Quantity: {{
                                        item.quantity }}</span>
                                </div>
                                <span class="text-surface-900 dark:text-surface-0 font-medium text-lg ml-auto">{{
                                    formatCurrency(item.price * item.quantity) }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="flex flex-wrap mt-8 pb-4">
                        <div class="w-full lg:w-6/12 pl-4">
                            <span class="font-medium text-surface-900 dark:text-surface-0">Shipping Address</span>
                            <div class="flex flex-col text-surface-900 dark:text-surface-0 mt-4 mb-8">
                                <span class="mb-1">{{ order.shipping_first_name }} {{ order.shipping_last_name }}</span>
                                <span class="mb-1">{{ order.shipping_address }}, {{ order.shipping_city }} {{
                                    order.shipping_country }} {{ order.shipping_postal_code }}</span>
                                <span>{{ order.shipping_email }}</span>
                            </div>
                            <span class="font-medium text-surface-900 dark:text-surface-0">Payment</span>
                            <div class="flex items-center mt-4">
                                <i :class="getPaymentMethodIcon(order.payment_method)" class="mr-2 text-2xl"></i>
                                <div class="flex flex-col">
                                    <span class="text-surface-900 dark:text-surface-0 mb-1">{{
                                        getPaymentMethodLabel(order.payment_method) }}</span>
                                    <span v-if="order.payment_method === 'stripe'"
                                        class="text-surface-900 dark:text-surface-0 font-medium">**** **** ****
                                        1234</span>
                                </div>
                            </div>
                        </div>
                        <div class="w-full lg:w-6/12 pl-4 lg:pl-0 lg:pr-4 flex items-end mt-8 lg:mt-0">
                            <ul class="list-none p-0 m-0 w-full">
                                <li class="mb-4">
                                    <span class="font-medium text-surface-900 dark:text-surface-0">Summary</span>
                                </li>
                                <li class="flex justify-between mb-4">
                                    <span class="text-surface-900 dark:text-surface-0">Subtotal</span>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium text-lg">{{
                                        formatCurrency(subtotal) }}</span>
                                </li>
                                <li class="flex justify-between mb-4">
                                    <span class="text-surface-900 dark:text-surface-0">Shipping</span>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium text-lg">{{
                                        formatCurrency(shippingCost) }}</span>
                                </li>
                                <!-- <li class="flex justify-between mb-4">
                                <span class="text-surface-900 dark:text-surface-0">Tax</span>
                                <span class="text-surface-900 dark:text-surface-0 font-medium text-lg">{{ formatCurrency(tax) }}</span>
                            </li> -->
                                <li
                                    class="flex justify-between border-t border-surface-200 dark:border-surface-700 py-4">
                                    <span class="text-surface-900 dark:text-surface-0 font-medium">Total</span>
                                    <span class="text-surface-900 dark:text-surface-0 font-bold text-lg">{{
                                        formatCurrency(order.total_amount) }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';

const props = defineProps({
    order: Object,
});

const orderItems = computed(() => {
    return props.order.items; // Access items relationship
});

const subtotal = computed(() => {
    let total = 0;
    if (orderItems.value) {
        orderItems.value.forEach(item => {
            total += item.price * item.quantity;
        });
    }
    return total;
});

const shippingCost = computed(() => {
    // Replace with your actual shipping cost logic or data
    return 0;
});

const tax = computed(() => {
    // Replace with your actual tax calculation logic or data
    return 4;
});

function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(value);
}

function getPaymentMethodIcon(method) {
    switch (method) {
        case 'stripe':
            return 'pi pi-credit-card'; // PrimeIcons for card
        case 'cod':
            return 'pi pi-wallet'; // PrimeIcons for cash/wallet
        case 'bank_transfer':
            return 'pi pi-bank'; // PrimeIcons for bank
        default:
            return 'pi pi-question'; // Default icon
    }
}

function getPaymentMethodLabel(method) {
    switch (method) {
        case 'stripe':
            return 'Card';
        case 'cod':
            return 'Cash On Delivery';
        case 'bank_transfer':
            return 'Bank Transfer';
        default:
            return method;
    }
}
</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    padding: 1rem 2rem;
    /* Adjusted padding */
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    /* Ensure padding for content */
}
</style>