<script setup>
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout })
</script>

<template>

    <Head title="Shipping Policy | Art Collector" />
    <div class="bg-white">
        <div class="max-w-4xl mx-auto px-4 py-16">
            <h1 class="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Shipping Policy</h1>
            <div class="prose prose-lg text-gray-700">
                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Dispatch & Delivery Times</h2>
                <p>The shipment of your order begins as soon as the design you selected is completed. Please consider
                    that each order is unique and custom-made according to your needs and preferences, which may affect
                    completion and delivery times.</p>
                <ul class="list-disc pl-5 mb-4">
                    <li><strong>General Orders:</strong> We strive to dispatch web orders to our courier/transport
                        company within 5 to 14 days.</li>
                    <li><strong>Frames & Canvases:</strong> Custom frames require 10 business days for production, plus
                        an additional 1 to 2 business days for shipping. Overall, it takes a minimum of 5 to 15 business
                        days to receive your order.</li>
                </ul>
                <p>Every frame is placed in a special transport box with the necessary protection levels to ensure safe
                    transit and delivery. Note that the times listed above are indicative, and we cannot guarantee exact
                    delivery dates due to the custom nature of our products.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Courier & Shipping Costs</h2>
                <p>Our primary shipping partner is ELTA Courier. The shipping cost is calculated based on the size and
                    weight of the products.</p>
            </div>
        </div>
    </div>
</template>