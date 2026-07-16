<script setup>
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout })

</script>

<template>
    <!-- Ενσωμάτωση SEO και Social Media Meta Tags -->

    <Head>
        <title>About Us | Pinakothiki B2B Art Platform</title>
        <meta name="description"
            content="Pinakothiki offers curated artworks and custom B2B art solutions for hotels, corporate spaces, architects, and interior designers. Discover our philosophy and collections." />
        <meta name="keywords"
            content="about Pinakothiki, B2B art platform, art for business, hotel artwork, wholesale art Greece, contract art, interior design art, curated wall art" />

        <!-- Social Media Meta Tags (Open Graph) -->
        <meta property="og:title" content="Pinakothiki — Art for the Professional World" />
        <meta property="og:description"
            content="Discover how Pinakothiki helps hotels, designers, and professional spaces transform interiors through curated contemporary art." />
    </Head>

    <div class="w-full bg-white mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <!-- Κεντρική Επικεφαλίδα & Φιλοσοφία -->
        <div class="max-w-3xl mx-auto text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                About
            </h1>
            <p class="text-2xl text-gray-600 font-light italic mb-10">
                "Handcrafted aesthetics, designed to last."
            </p>
        </div>

        <!-- Κυρίως Περιεχόμενο: Φιλοσοφία & Διαδικασία -->
        <div class="max-w-7xl mx-auto mb-16 space-y-12 lg:space-y-16 text-gray-700 leading-relaxed text-lg">

            <!-- Row 1: Text Left, Image Right -->
            <div
                class="bg-white shadow-sm rounded-xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <!-- Κείμενο -->
                <div class="space-y-6">
                    <p>
                        At <span class="font-semibold text-gray-900">PINAKOTHIKI</span>, the art of framing lies at the
                        heart of everything we
                        create. Since 1970, we have been crafting handmade frames and curated art applications with a
                        focus on
                        detail, quality, and timeless aesthetics.
                    </p>
                    <p>
                        Every frame and artwork is made to order in our workshop in Agrinio, Greece, with careful
                        attention to
                        materials, proportions, and the unique character of each piece. From minimal compositions to
                        oversized
                        custom applications, every creation is designed to bring presence, balance, and longevity into a
                        space.
                    </p>
                </div>
                <!-- Εικόνα -->
                <div class="relative w-full h-72 lg:h-full min-h-[350px] rounded-lg overflow-hidden shadow-inner">
                    <!-- Αντικατάστησε το src με την πραγματική σου εικόνα -->
                    <img src="/images/workshop.jpg" alt="Pinakothiki Workshop"
                        class="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>

            <!-- Row 2: Image Left, Text Right -->
            <div
                class="bg-white shadow-sm rounded-xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <!-- Εικόνα (Στα κινητά θα εμφανιστεί δεύτερη, αλλά στα desktop αριστερά) -->
                <div
                    class="relative w-full h-72 lg:h-full min-h-[350px] rounded-lg overflow-hidden shadow-inner order-2 lg:order-1">
                    <!-- Αντικατάστησε το src με την πραγματική σου εικόνα -->
                    <img src="/images/materials.jpeg" alt="Premium Materials"
                        class="absolute inset-0 w-full h-full object-cover" />
                </div>
                <!-- Κείμενο -->
                <div class="space-y-6 order-1 lg:order-2">
                    <p>
                        We collaborate with people who appreciate design, art, and interiors with personality, to create
                        pieces
                        that balance functionality with refined visual identity.
                    </p>
                    <p>
                        Using premium materials, from wood and canvas to fine art papers and professional printing
                        techniques,
                        we ensure a result that stands out not only for its craftsmanship, but also for the feeling it
                        brings
                        into a space.
                    </p>
                </div>
            </div>

        </div>

        <!-- Ενότητα: Η Ιστορία μας (Timeline Style) -->
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center border-b pb-4">Our History</h2>

            <div class="space-y-10">
                <!-- 1970 -->
                <div class="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                    <div class="md:w-1/5 shrink-0">
                        <span class="text-2xl font-bold text-gray-900">1970</span>
                    </div>
                    <div class="md:w-4/5 text-gray-600 text-lg">
                        <span class="font-semibold text-gray-800">Charilaos Tsoutsikos</span> established a family
                        business dedicated to handcrafted framing in Adelaide, Australia, laying the foundations for a
                        tradition that continues to this day.
                    </div>
                </div>

                <!-- 1982 -->
                <div class="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                    <div class="md:w-1/5 shrink-0">
                        <span class="text-2xl font-bold text-gray-900">1982</span>
                    </div>
                    <div class="md:w-4/5 text-gray-600 text-lg">
                        <span class="font-semibold text-gray-800">Dimitris Tsoutsikos</span> brings the art of framing
                        to Greece, founding a contemporary workshop that combines traditional craftsmanship with modern
                        techniques and aesthetics.
                    </div>
                </div>

                <!-- 2014 -->
                <div class="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                    <div class="md:w-1/5 shrink-0">
                        <span class="text-2xl font-bold text-gray-900">2014</span>
                    </div>
                    <div class="md:w-4/5 text-gray-600 text-lg">
                        The third generation, led by <span class="font-semibold text-gray-800">Filippos Nektarios
                            Tsoutsikos</span>, launched PINAKOTHIKI with a vision of international growth and creative
                        expansion. Through participation in exhibitions across Greece and abroad, the company undertakes
                        high-end art and framing projects, focusing on quality, detail, and contemporary design.
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>