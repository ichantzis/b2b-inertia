<script setup>
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout })
</script>

<template>

    <Head title="Returns & Refunds | Art Collector" />
    <div class="bg-white">
        <div class="max-w-4xl mx-auto px-4 py-16">
            <h1 class="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Returns & Refunds</h1>
            <div class="prose prose-lg text-gray-700">
                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Paintings, Posters & Frames</h2>
                <p>You may notice a slight difference in the color of a painting or frame compared to what is displayed
                    on the website. This is due to individual monitor settings, resolution, and the natural
                    characteristics of the wood used for frames.</p>
                <p>In these cases, the right to revoke or cancel the order is not provided unless the cancellation
                    relates to a product defect, such as damage or the delivery of an incorrect product (a different
                    design than the one ordered). Furthermore, returns or exchanges are not accepted if the difference
                    in colors, dimensions, or design is minimal (less than 12% for paintings/frames, and less than 10%
                    for passepartout).</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Return Charges</h2>
                <p>In the event of a valid return, the customer bears the cost of return shipping. Additionally, the
                    Company retains a flat fee of 10 EUR as an administrative charge to cover bank commissions and
                    third-party provider fees involved in fulfilling the order.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Order Cancellation</h2>
                <p>Once an order is completed and paid via bank deposit, credit card, or PayPal, the transaction is
                    considered final and cannot be canceled.</p>
                <p>Cancellation is only possible if the production of your order has not yet started. For a cancellation
                    to be accepted, you must receive prior confirmation from the Company (via email or phone) that
                    production has not commenced. If approved, the Company will refund the paid amount minus a 10 EUR
                    administrative fee to cover transaction commissions.</p>
            </div>
        </div>
    </div>
</template>