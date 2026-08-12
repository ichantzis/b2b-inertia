<script setup>
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout })
</script>

<template>

    <Head title="Privacy Policy | Art Collector" />
    <div class="bg-white">
        <div class="max-w-4xl mx-auto px-4 py-16">
            <h1 class="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Privacy & Cookies Policy</h1>
            <div class="prose prose-lg text-gray-700">
                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Data Collection & Purpose</h2>
                <p>We may collect personal information such as your name, email address, postal address, phone number,
                    date of birth, and payment details when you visit our store, register, place an order, or
                    communicate with us.</p>
                <p>Your personal data is processed for the following purposes:</p>
                <ul class="list-disc pl-5 mb-4">
                    <li>Managing your registration and executing sales contracts (processing and delivering orders).
                    </li>
                    <li>Creating a commercial profile to offer tailored content, products, and services based on your
                        browsing behavior.</li>
                    <li>Sending information about exclusive offers and latest news (via email, SMS, etc.) with your
                        consent.</li>
                    <li>Preventing and detecting fraud in the use of our services.</li>
                </ul>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Data Protection & Retention</h2>
                <p>We use information security techniques, access control procedures, and encryption mechanisms to
                    prevent unauthorized access to your data. Payment data is sent directly and securely to the relevant
                    financial entity. Data is retained only for the time reasonably necessary to fulfill legal
                    obligations or resolve issues.</p>

                <h2 class="text-xl font-semibold mt-6 mb-3 text-gray-800">Your Rights (GDPR)</h2>
                <p>You have the right to access, correct, delete (right to be forgotten), or restrict the processing of
                    your personal data. You also hold the right to data portability and the right to object to
                    processing for direct marketing purposes. To exercise these rights, or if you wish to file a
                    complaint, you may contact us using the details provided in our Terms of Service or contact the
                    local Data Protection Authority.</p>
            </div>
        </div>
    </div>
</template>