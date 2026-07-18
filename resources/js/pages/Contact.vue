<script setup>
import { Head as InertiaHead, useForm } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

// PrimeVue Components
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
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please check the form for errors.', life: 3000 });
        }
    });
};

// SEO Data (JSON-LD)
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact | PINAKOTHIKI",
    "description": "Contact the PINAKOTHIKI team for custom artworks, handcrafted frames, bespoke applications, and creative collaborations.",
    "url": window.location.href
};
</script>

<template>
    <InertiaHead>
        <title>Contact | PINAKOTHIKI</title>
        <meta name="description" content="Contact the PINAKOTHIKI team for custom artworks, handcrafted frames, bespoke applications, and creative collaborations." />
        <meta name="keywords" content="contact Pinakothiki, custom frames Greece, handcrafted frames, art prints Greece, wholesale art order Greece, B2B art contact" />
        
        <!-- Social Meta Tags -->
        <meta property="og:title" content="Contact PINAKOTHIKI" />
        <meta property="og:description" content="For custom artworks, handcrafted frames, and creative collaborations, the PINAKOTHIKI team is here to help." />
        
        <component is="script" type="application/ld+json">{{ JSON.stringify(jsonLd) }}</component>
    </InertiaHead>

    <section class="bg-white p-2 sm:p-12 md:p-24">
        <div class="flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden bg-white dark:bg-surface-800">

            <!-- Αριστερό Πάνελ (Πληροφορίες) -->
            <div class="lg:w-5/12 bg-surface-900 text-white flex flex-col justify-center items-start text-left p-8 md:p-16">

                <h1 class="text-3xl font-bold mb-6 leading-tight">
                    Let’s create something unique for your space.
                </h1>

                <div class="text-surface-300 mb-8 leading-relaxed text-base space-y-4">
                    <p>
                        The PINAKOTHIKI team is here to help you select the right artworks, frames, and custom art solutions for your space.
                    </p>
                    <p>
                        From individual pieces to complete wall compositions and bespoke applications, we create tailored proposals designed around the character and aesthetic of every interior.
                    </p>
                    <p>
                        Get in touch with us for price lists, custom orders, collaborations, or more information about our collections and services.
                    </p>
                </div>

                <p class="text-surface-400 mb-10 font-semibold text-xs uppercase tracking-widest">
                    Canvas prints & posters • Handcrafted frames • Made in Greece
                </p>

                <!-- Κοινωνικά Δίκτυα -->
                <div class="flex gap-6 text-xl">
                    <a href="https://www.facebook.com/pinakothiki.FineArtPrints" target="_blank" rel="noopener nofollow"
                        class="w-10 h-10 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Facebook">
                        <i class="pi pi-facebook"></i>
                    </a>
                    <a href="https://www.instagram.com/pinakothiki/" target="_blank" rel="noopener nofollow"
                        class="w-10 h-10 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Instagram">
                        <i class="pi pi-instagram"></i>
                    </a>
                    <a href="mailto:info@pinakothiki.gr" target="_blank" rel="nofollow noopener"
                        class="w-10 h-10 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Email">
                        <i class="pi pi-envelope"></i>
                    </a>
                </div>
            </div>

            <!-- Δεξί Πάνελ (Φόρμα) -->
            <div class="lg:w-7/12 bg-white dark:bg-surface-800 p-8 md:p-16 flex flex-col justify-center">

                <div class="text-center mb-10">
                    <h2 class="text-2xl md:text-3xl font-medium tracking-wide uppercase text-surface-900 dark:text-surface-0">
                        CONTACT FORM
                    </h2>
                </div>

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
    </section>
</template>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}
</style>