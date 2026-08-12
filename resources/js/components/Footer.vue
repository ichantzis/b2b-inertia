<template>
    <!-- Αφαιρέσαμε το σκούρο bg από το main footer για να έχουμε ανοιχτόχρωμο top section -->
    <footer class="mt-auto font-light">
        
        <!-- ==========================================
             NEWSLETTER SECTION (Light Theme)
             ========================================== -->
        <div class="bg-[#f5f5f5] py-16 border-b border-gray-200 text-black">
            <Container>
                <!-- Κεντραρισμένο container με περιορισμένο πλάτος (max-w-2xl) -->
                <div class="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                    
                    <h3 class="text-lg md:text-xl font-medium mb-6">
                        Join our community and receive 10% off your first order.
                    </h3>
                    
                    <!-- Φόρμα: Σε κινητά το ένα κάτω από το άλλο, σε desktop δίπλα-δίπλα -->
                    <div class="flex flex-col sm:flex-row w-full gap-3 justify-center items-center mb-4">
                        <InputText 
                            placeholder="Enter your email"
                            class="w-full sm:w-[400px] !rounded-full border-gray-400 px-6 py-3 text-gray-800 bg-white focus:border-black focus:ring-1 focus:ring-black" 
                        />
                        <Button 
                            label="Sign up" 
                            class="!bg-[#171717] !text-white border-none hover:!bg-black font-medium px-8 py-3 !rounded-full shrink-0" 
                        />
                    </div>
                    
                    <!-- Νομικό Κείμενο (Disclaimer) -->
                    <p class="text-xs text-black font-medium mt-2">
                        By subscribing, you agree to receive our newsletter and our Privacy Policy. You may unsubscribe at any time.
                    </p>
                    
                </div>
            </Container>
        </div>

        <!-- ==========================================
             MAIN FOOTER LINKS (Dark Theme)
             ========================================== -->
        <div class="bg-[#1a1a1a] text-gray-400 text-sm">
            <div class="py-16">
                <Container>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <h4 class="text-white font-medium text-lg mb-6 tracking-wide">PINAKOTHIKI</h4>
                            
                            <div class="mb-6 text-gray-400 leading-relaxed">
                                || artcollector.gr - Gallery || <br>
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
                                    <Link :href="route('policy.shipping')" class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                        Shipping Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link :href="route('policy.returns')" class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                        Returns & Refunds
                                    </Link>
                                </li>
                                <li>
                                    <Link :href="route('policy.terms')" class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link :href="route('policy.privacy')" class="hover:text-white transition-colors duration-200 no-underline block w-fit">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" class="hover:text-white transition-colors duration-200 no-underline block w-fit">
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

            <!-- COPYRIGHT BAR -->
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
/* Ensure input placeholder styling matches the design */
:deep(.p-inputtext::placeholder) {
    color: #6b7280;
}

a {
    text-decoration: none;
    color: inherit;
}
</style>