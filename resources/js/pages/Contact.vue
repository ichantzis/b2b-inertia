<script setup>
import { Head as InertiaHead, useForm } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

// PrimeVue Components (Ensure these are imported if not auto-imported)
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

// SEO Data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "description": "Contact Pinakothiki support team for inquiries about art prints and orders.",
    "url": window.location.href
};
</script>

<template>
    <InertiaHead>
        <title>Contact Us</title>
        <meta name="description"
            content="Get in touch with Pinakothiki. We are here to help with your art print orders, custom requests, and general inquiries." />
        <component is="script" type="application/ld+json">{{ JSON.stringify(jsonLd) }}</component>
    </InertiaHead>

    <Container class="py-12 md:py-24">
        <div class="flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden bg-white dark:bg-surface-800">

            <div
                class="lg:w-5/12 bg-surface-900 text-white flex flex-col justify-center items-center text-center p-8 md:p-16">

                <h1 class="text-3xl font-bold mb-6">PINAKOTHIKI</h1>

                <p class="text-surface-300 mb-8 leading-relaxed text-lg">
                    Paintings on canvas or poster <br>
                    Discover Unique Art for your space! <br>
                    Handmade • Free Shipping • Made in Greece
                </p>

                <div class="flex gap-6 text-2xl">
                    <a href="https://www.facebook.com/pinakothiki.FineArtPrints" target="_blank" rel="noopener nofollow"
                        class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Facebook">
                        <i class="pi pi-facebook"></i>
                    </a>
                    <a href="https://www.instagram.com/pinakothiki/" target="_blank" rel="noopener nofollow"
                        class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Instagram">
                        <i class="pi pi-instagram"></i>
                    </a>
                    <a href="mailto:info@pinakothiki.gr" target="_blank" rel="nofollow noopener"
                        class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300"
                        aria-label="Email">
                        <i class="pi pi-envelope"></i>
                    </a>
                </div>
            </div>

            <div class="lg:w-7/12 bg-white dark:bg-surface-800 p-8 md:p-16 flex flex-col justify-center">

                <div class="text-center mb-10">
                    <h2 class="text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-0">
                        Contact Us
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
    </Container>
</template>
<style scoped>
a {
    text-decoration: none;
    color: inherit;

}
</style>