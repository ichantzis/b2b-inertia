<template>
    <HeaderLayout>

        <Head title="Order Complete" />
        <Container>
            <PageTitleSection title="Order Complete" />

            <div class="bg-green-50 border-t-4 border-green-500 rounded-b shadow-md p-4 mb-4" role="alert">
                <div class="flex">
                    <div class="py-1">
                        <svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <path
                                d="M0 11c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V5c0-1.1-.9-2-2-2H2C.9 3 0 3.9 0 5v6zm2-1v1H18v-1H2zm16-4H2v1h16V6zM2 8h16v1H2V8z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold">Order Placed Successfully!</p>
                        <p class="text-sm text-gray-700">Thank you for your order. Your order number is {{
                            order.order_number }}.</p>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow-md rounded-md p-4">
                <h2 class="text-lg font-semibold mb-4">Order Details</h2>
                <p>Shipping Address: {{ order.shipping_address }}, {{ order.shipping_city }}, {{ order.shipping_country
                    }} {{ order.shipping_postal_code }}</p>
                <p>Payment Method: {{ order.payment_method }}</p>
                <p>Total Amount: {{ formatCurrency(order.total_amount) }}</p>

            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { defineProps } from 'vue';
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';

const props = defineProps({
    order: Object,
});

function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(value);
}
</script>