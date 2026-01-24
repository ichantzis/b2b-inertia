<template>
    <footer class="bg-[#1a1a1a] text-gray-400 text-sm mt-auto font-light">
        <div class="border-b border-gray-800">
            <Container>
                <div class="flex flex-col md:flex-row items-center justify-between py-10 gap-6">
                    <div class="text-center md:text-left">
                        <h3 class="text-xl font-medium text-white mb-2">Stay in the loop</h3>
                        <p class="text-gray-500">Subscribe to receive inspiration, ideas, and news.</p>
                    </div>
                    <div class="flex w-full md:w-auto gap-3">
                        <InputText placeholder="Your email address"
                            class="w-full md:w-80 bg-[#252525] border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-0" />
                        <Button label="Subscribe" severity="secondary"
                            class="bg-white text-black border-none hover:bg-gray-200 font-medium px-6" />
                    </div>
                </div>
            </Container>
        </div>

        <div class="py-16">
            <Container>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <h4 class="text-white font-medium text-lg mb-6 tracking-wide">PINAKOTHIKI</h4>
                        
                        <div class="mb-6 text-gray-400 leading-relaxed">
                            || b2b.pinakothiki.gr - Gallery || <br>
                            Paintings on canvas or poster <br>
                            Discover Unique Art for your space! <br>
                            Handmade • Free Shipping • Made in Greece
                        </div>

                        <ul class="space-y-4">
                            <li class="flex items-center gap-3 group">
                                <i class="pi pi-envelope text-gray-500 group-hover:text-white transition-colors"></i>
                                <a href="mailto:info@pinakothiki.com"
                                    class="hover:text-white transition-colors no-underline">info@pinakothiki.com</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-medium text-lg mb-6 tracking-wide">Information</h4>
                        <ul class="space-y-3">
                            <li>
                                <Link :href="route('welcome')"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Home
                                </Link>
                            </li>
                            <li>
                                <Link :href="route('collections.index')"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Collections
                                </Link>
                            </li>
                            <li>
                                <Link :href="route('artists.overview')"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Artists
                                </Link>
                            </li>
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                About Us
                                </Link>
                            </li>
                            <li>
                                <Link :href="route('contact.index')"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-medium text-lg mb-6 tracking-wide">Customer Service</h4>
                        <ul class="space-y-3">
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#"
                                    class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-medium text-lg mb-6 tracking-wide">Follow Us</h4>
                        <div class="flex gap-4 mb-8">
                            <a href="#"
                                class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group">
                                <i class="pi pi-facebook text-lg"></i>
                            </a>
                            <a href="#"
                                class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group">
                                <i class="pi pi-instagram text-lg"></i>
                            </a>
                            <a href="#"
                                class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group">
                                <i class="pi pi-pinterest text-lg"></i>
                            </a>
                        </div>

                        <h4 class="text-white font-medium text-lg mb-4 tracking-wide">Secure Payments</h4>
                        <div class="flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                            <i class="pi pi-credit-card text-2xl hover:text-white transition-colors"></i>
                            <i class="pi pi-wallet text-2xl hover:text-white transition-colors"></i>
                            <i class="pi pi-paypal text-2xl hover:text-white transition-colors"></i>
                        </div>
                    </div>
                </div>
            </Container>
        </div>

        <div class="bg-black py-6 border-t border-gray-900">
            <Container>
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p class="font-light">&copy; {{ new Date().getFullYear() }} Pinakothiki. All rights reserved.</p>
                    <div class="flex gap-4">
                        <span class="hover:text-gray-400 cursor-pointer transition-colors"><a class="text-grey-700 hover:text-gray-400"
                                href="https://www.oneplusdesign.com/">Designed & Developed by OnePlus Design.</a></span>
                    </div>
                </div>
            </Container>
        </div>
    </footer>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import Container from '@/components/Container.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
</script>

<style scoped>
/* Ensure input placeholder styling matches the dark theme */
:deep(.p-inputtext::placeholder) {
    color: #6b7280;
}

a {
    text-decoration: none;
    color: inherit;

}
</style>