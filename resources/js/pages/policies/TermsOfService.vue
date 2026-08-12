<script setup>
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout })
</script>

<template>

    <Head title="Terms of Service | Art Collector" />
    <div class="bg-white">
        <div class="max-w-4xl mx-auto px-4 py-16">
            <h1 class="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>
            <div class="prose prose-lg text-gray-700">
                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">General Information</h2>
                <p>This website constitutes the official online store of the company under the name "TSOUTSIKOS
                    NEKTARIOS FILIPPOS" with the distinctive title "PINAKOTHIKI", located in Agrinio, at 15 Agiou
                    Georgiou Street, with VAT number 126657501.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Terms of Use</h2>
                <p>By accessing this website, whether as a guest or a registered member, you explicitly and unreservedly
                    consent to these terms of use. The use of this online store by minors or individuals lacking legal
                    capacity is prohibited. If you do not agree with these terms, you must refrain from using the
                    website.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Products & Pricing</h2>
                <p>All prices presented in the catalogs are in Euros and include all tax charges (VAT), except for
                    shipping costs unless stated otherwise. The Company reserves the right to freely adjust product
                    prices at any time, but is committed to applying the prices listed on the website at the time of
                    your order.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Intellectual Property</h2>
                <p>All intellectual property rights, trademarks, texts, graphics, photographs, and logos provided on
                    this website belong to the Company or its licensors. Any copying, distribution, modification, or
                    resale of the content without prior written consent is strictly prohibited.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Limitation of Liability & Jurisdiction</h2>
                <p>The Company is liable only for intent or gross negligence regarding delays or information provided
                    through its store. It does not guarantee the uninterrupted or error-free operation of the website.
                    Any dispute arising in relation to the use of the online store shall be resolved exclusively by the
                    courts of Agrinio.</p>
            </div>
        </div>
    </div>
</template>