<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Message from 'primevue/message';

defineOptions({ layout: HeaderLayout })

const toast = useToast();

const form = useForm({
    name: '',
    email: '',
    phone: '',
    message: ''
});

const submit = () => {
    form.post(route('contact.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            // toast.add({ severity: 'success', summary: 'Success', detail: 'Message sent successfully!', life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please check the form for errors.', life: 3000 });
        }
    });
};
</script>

<template>
    <!-- Ενσωμάτωση SEO και Social Media Meta Tags -->

    <Head>
        <title>Collaborations | Art Collector</title>
        <meta name="description"
            content="Collaborate with Art Collector for custom artworks, handcrafted frames, and contemporary art solutions tailored to your project." />
        <meta name="keywords"
            content="Pinakothiki collaborations, art partnerships Greece, custom art solutions, framing collaborations, wholesale art partnerships" />

        <!-- Social Media Meta Tags -->
        <meta property="og:title" content="Hop On Board | Art Collector" />
        <meta property="og:description"
            content="Join the Art Collector partner network and create contemporary art and framing projects with us." />
    </Head>

    <div class="w-full bg-white mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <!-- ΕΝΟΤΗΤΑ 1: Κείμενο και CTA (Δίπλα - Δίπλα σε μεγάλες οθόνες) -->
        <div
            class=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 bg-white p-2 sm:p-8 md:p-12 shadow-sm rounded-xl">

            <!-- Αριστερή Στήλη: Κείμενο -->
            <div>
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Hop On Board - <br class="hidden md:block" /> Let’s Collaborate
                </h1>
                <h2 class="text-2xl text-gray-700 font-semibold mb-6">
                    Interested in working together?
                </h2>
                <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                    <span class="font-semibold text-gray-800">Art Collector</span> collaborates with architects,
                    interior designers, hotels, concept stores, furniture stores and creative professionals looking for
                    contemporary art and framing solutions with refined aesthetics and flexibility.
                </p>
                <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                    Fill out the contact form and a member of our team will get in touch with you shortly to discuss
                    your project, ideas, and collaboration opportunities.
                </p>
                <p class="text-xl font-medium text-gray-900 border-l-4 border-gray-900 pl-4">
                    Join the growing network of ART Collector partners.
                </p>
            </div>

            <!-- Δεξιά Στήλη: Φόρμα ή CTA Buttons -->
            <div class="bg-gray-50 p-2 sm:p-8 rounded-lg border border-gray-100 flex flex-col space-y-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Get in Touch</h3>
                <button
                    class="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded hover:bg-gray-800 transition duration-150 shadow-sm">
                    Contact Us
                </button>
                <button
                    class="w-full bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-4 rounded hover:bg-gray-50 transition duration-150">
                    Start Your Collaboration
                </button>
                <button
                    class="w-full bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-4 rounded hover:bg-gray-50 transition duration-150">
                    Discuss Your Project
                </button>
                <button
                    class="w-full bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-4 rounded hover:bg-gray-50 transition duration-150">
                    Join Our Partner Network
                </button>
                <form @submit.prevent="submit" class="space-y-6 max-w-lg mx-auto w-full">

                    <div class="flex flex-col gap-2">
                        <label for="name" class="font-medium text-surface-700 dark:text-surface-200">
                            Full Name <span class="text-red-500">*</span>
                        </label>
                        <InputText id="name" v-model="form.name" :invalid="!!form.errors.name" class="w-full" />
                        <small v-if="form.errors.name" class="text-red-500">{{ form.errors.name }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="phone" class="font-medium text-surface-700 dark:text-surface-200">
                            Phone <span class="text-red-500">*</span>
                        </label>
                        <InputText id="phone" v-model="form.phone" :invalid="!!form.errors.phone" class="w-full" />
                        <small v-if="form.errors.phone" class="text-red-500">{{ form.errors.phone }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email" class="font-medium text-surface-700 dark:text-surface-200">
                            Email <span class="text-red-500">*</span>
                        </label>
                        <InputText id="email" type="email" v-model="form.email" :invalid="!!form.errors.email"
                            class="w-full" />
                        <small v-if="form.errors.email" class="text-red-500">{{ form.errors.email }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="message" class="font-medium text-surface-700 dark:text-surface-200">
                            Message <span class="text-red-500">*</span>
                        </label>
                        <Textarea id="message" v-model="form.message" rows="5" :invalid="!!form.errors.message"
                            class="w-full" />
                        <small v-if="form.errors.message" class="text-red-500">{{ form.errors.message }}</small>
                    </div>

                    <div class="pt-2">
                        <Button type="submit" label="Send Message" class="w-full font-bold" :loading="form.processing" />
                    </div>

                    <div v-if="form.wasSuccessful">
                        <Message severity="success" :closable="false">Your message has been sent successfully!</Message>
                    </div>
                </form>
            </div>
        </div>

        <!-- ΕΝΟΤΗΤΑ 2: Meet Our Partners -->
        <div>
            <!-- Επικεφαλίδα Συνεργατών -->
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Meet Our Partners</h2>
                <p class="text-xl text-gray-600 italic">
                    "Creative collaborations built on aesthetics, trust, and contemporary design."
                </p>
            </div>

            <!-- Συνεργάτες Ανά Περιοχή -->
            <div class="space-y-16 max-w-5xl mx-auto">

                <!-- ΑΤΤΙΚΗ -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-8 tracking-wide">Attica
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-freskos.png" alt="Freskos Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-lipshop.png" alt="Lipshop Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                    </div>
                </div>

                <!-- ΚΡΗΤΗ -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-8 tracking-wide">Crete
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-magerakis.png" alt="Magerakis Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-kastino.png" alt="Kastino Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-kaloterakis.png" alt="Kaloterakis Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                    </div>
                </div>

                <!-- ΥΠΟΛΟΙΠΟ ΕΛΛΑΔΑ -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-8 tracking-wide">
                        Rest Greece</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-onirome.png" alt="Onirome Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-epiplagiaolous.png" alt="Epiplagiaolous Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                        <div
                            class="bg-white shadow-sm flex items-center justify-center rounded-lg border border-gray-100 h-32 opacity-70 hover:opacity-100 hover:shadow-md transition duration-200">
                            <img src="/images/clients/partners-internioggi.png" alt="Internioggi Partner"
                                class="inset-0 w-full h-full object-cover select-none" 
                                @contextmenu.prevent 
                                draggable="false" />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>