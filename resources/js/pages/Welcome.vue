<script setup>
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import { usePage, Link, Head as InertiaHead } from '@inertiajs/vue3';
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Divider from 'primevue/divider';
import { slugify } from '@/composables/utils.js';

defineOptions({ layout: HeaderLayout })

defineProps({
    canLogin: {
        type: Boolean,
    },
    canRegister: {
        type: Boolean,
    },
    laravelVersion: {
        type: String,
        required: true,
    },
    phpVersion: {
        type: String,
        required: true,
    },
    curatedLists: {
        type: Array,
        required: true,
    },
});

const features = [
    {
        image: '/images/mocks/MOCK-UP-SET-P-8144.jpg',
        title: 'Lists',
        description: 'Explore our curated art collections',
        route: 'lists'
    },
    {
        image: '/images/mocks/MOCK-UP-C-2553043.jpg',
        title: 'Artworks',
        description: 'Discover unique artworks',
        route: 'artworks'
    }
];

const page = usePage();

const carouselResponsiveOptions = ref([
    {
        breakpoint: '1280px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);

// Προσωρινά δεδομένα (Mock Data) για να δοκιμάσουμε το Carousel (21 στοιχεία)
const recentlyViewedItems = ref(
    Array.from({ length: 21 }).map((_, index) => ({
        id: index + 1,
        title: `Artwork ${index + 1}`,
        image: `https://picsum.photos/seed/${index + 1}/400/500` // Τυχαίες εικόνες
    }))
);

const heroSettings = computed(() => {
    return page.props.heroSettings || {
        image: '/images/hero-bg.jpg.png', // Προεπιλεγμένη εικόνα
        title: 'Premium Art on Canvas Custom Made by hand with Love',
        subtitle: 'Art Prints for Every Personality',
        button1_text: 'Shop Prints',
        button1_link: '/artworks?category=prints',
        button2_text: 'Shop Frames',
        button2_link: '/artworks?category=frames'
    };
});

const featuredColumns = computed(() => page.props.featuredColumns || {
    col1: { title: 'Column 1', link: '#', image: '/images/placeholder.png' },
    col2: { title: 'Column 2', link: '#', image: '/images/placeholder.png' },
    col3: { title: 'Column 3', link: '#', image: '/images/placeholder.png' }
});

const editorSettings = computed(() => page.props.editorSettings || {
    title: 'THE EDITOR\'S PICK - MAY',
    description: 'Discover the world\'s top posters...',
    button_text: 'Shop Collection',
    button_link: '/artworks',
    image: null
});

// JSON-LD για το Brand/E-shop
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pinakothiki",
    "url": "https://b2b.pinakothiki.gr/", // Άλλαξε το με το domain σου
    "logo": "https://b2b.pinakothiki.gr/build/assets/PInakothiki-Logo-Header-CDixsy5W.png",
    "sameAs": [
        "https://www.facebook.com/pinakothiki.FineArtPrints",
        "https://www.instagram.com/pinakothiki/"
    ]
};

// --- RECENTLY VIEWED STATE ---
const recentlyViewed = ref([]);

onMounted(() => {
    const stored = localStorage.getItem('recently_viewed_items');
    if (stored) {
        try {
            recentlyViewed.value = JSON.parse(stored);
            console.log("Recently viewed items loaded:", recentlyViewed.value);

        } catch (e) {
            console.error("Error parsing recently viewed items", e);
        }
    }
});

</script>

<template>
    <InertiaHead>
        <title>Premium Art Prints & Custom Framing | Pinakothiki</title>
        <meta name="description"
            content="Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art." />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Premium Art Prints & Custom Framing | Pinakothiki" />
        <meta property="og:description"
            content="Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art." />
        <meta property="og:image"
            content="https://b2b.pinakothiki.gr/build/assets/PInakothiki-Logo-Header-CDixsy5W.png" />
        <component is="script" type="application/ld+json">
            {{ JSON.stringify(organizationSchema) }}
        </component>
    </InertiaHead>

    <!-- Hero Section -->
    <section class="relative w-full bg-white flex items-center justify-center overflow-hidden">
        <img :src="heroSettings.image" alt="Hero Banner"
            class="w-full h-auto max-h-[calc(100vh-100px)] object-contain block" />

        <div class="absolute inset-0"></div>

        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">

            <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wider uppercase drop-shadow-sm max-w-4xl">
                {{ heroSettings.title }}
            </h1>

            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium tracking-wide mt-2 md:mt-4">
                {{ heroSettings.subtitle }}
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8">
                <Link :href="heroSettings.button1_link">
                    <Button :label="heroSettings.button1_text"
                        class="!bg-white !border-black !text-black  uppercase tracking-widest px-6 py-3 sm:px-8 sm:py-3 rounded-none font-semibold transition-colors text-sm" />
                </Link>

                <Link :href="heroSettings.button2_link">
                    <Button :label="heroSettings.button2_text"
                        class="!bg-white !border-black !text-black  uppercase tracking-widest px-6 py-3 sm:px-8 sm:py-3 rounded-none font-semibold transition-colors text-sm" />
                </Link>
            </div>
        </div>
    </section>

    <!-- Featured 3 Columns Section -->
    <section class="w-full bg-white mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- Column 1 -->
            <!-- aspect-[4/5] ορίζει σταθερή αναλογία ώστε όλες οι εικόνες να έχουν το ίδιο ύψος και σχήμα (πορτρέτου) -->
            <Link :href="featuredColumns.col1.link"
                class="group relative block w-full overflow-hidden aspect-[4/5] bg-gray-100">
                <img :src="featuredColumns.col1.image" :alt="featuredColumns.col1.title"
                    class="absolute inset-0 w-full h-full object-cover" />
                <!-- Gradient Overlay για να διαβάζεται καθαρά ο τίτλος -->
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <!-- Title -->
                <div class="absolute bottom-6 left-6 pr-6">
                    <h3 class="text-white text-2xl tracking-wider drop-shadow-md">
                        {{ featuredColumns.col1.title }}
                    </h3>
                </div>
            </Link>

            <!-- Column 2 -->
            <Link :href="featuredColumns.col2.link"
                class="group relative block w-full overflow-hidden aspect-[4/5] bg-gray-100">
                <img :src="featuredColumns.col2.image" :alt="featuredColumns.col2.title"
                    class="absolute inset-0 w-full h-full object-cover" />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <div class="absolute bottom-6 left-6 pr-6">
                    <h3 class="text-white text-2xl tracking-wider drop-shadow-md">
                        {{ featuredColumns.col2.title }}
                    </h3>
                </div>
            </Link>

            <!-- Column 3 -->
            <Link :href="featuredColumns.col3.link"
                class="group relative block w-full overflow-hidden aspect-[4/5] bg-gray-100">
                <img :src="featuredColumns.col3.image" :alt="featuredColumns.col3.title"
                    class="absolute inset-0 w-full h-full object-cover" />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <div class="absolute bottom-6 left-6 pr-6">
                    <h3 class="text-white text-2xl tracking-wider drop-shadow-md">
                        {{ featuredColumns.col3.title }}
                    </h3>
                </div>
            </Link>

        </div>
    </section>

    <!-- Secondary Banner -->
    <!-- <section class="secondary-banner my-8 px-4">
        <div class="promo-banner-container relative rounded-xl overflow-hidden shadow-lg">
            <img src="/images/banner2.webp" alt="Timeless Art" class="w-full object-cover h-[300px]" />
            <div class="absolute inset-0 bg-black/20 flex flex-col justify-center p-8 text-white">
                 <h2 class="text-4xl font-serif">TIMELESS ART</h2> -->
    <!-- </div>
        </div>
    </section> -->

    <!-- Trust Icons Section -->
    <section class="trust-icons-section py-12 bg-gray-50 border-y border-gray-200">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h2 class="text-xl mb-10 text-gray-700 font-medium italic">
                Πινακοθήκη – Πίνακες σε καμβά ή poster | Ανακαλύψτε Μοναδική Τέχνη για τον χώρο σας!
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div class="icon-box">
                    <i class="pi pi-shield text-4xl mb-3 text-primary"></i>
                    <p class="font-semibold uppercase text-sm">Ασφαλείς Πληρωμές</p>
                </div>
                <div class="icon-box">
                    <i class="pi pi-star text-4xl mb-3 text-primary"></i>
                    <p class="font-semibold uppercase text-sm">Ξεχωριστά Χειροποίητο</p>
                </div>
                <div class="icon-box">
                    <i class="pi pi-map-marker text-4xl mb-3 text-primary"></i>
                    <p class="font-semibold uppercase text-sm">Κατασκευάζεται στην Ελλάδα</p>
                </div>
                <div class="icon-box">
                    <i class="pi pi-truck text-4xl mb-3 text-primary"></i>
                    <p class="font-semibold uppercase text-sm">Δωρεάν Μεταφορικά</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Editor's Pick Section -->
    <section class="w-full bg-[#F5F3E7]"> <!-- Το απαλό μπεζ χρώμα -->
        <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Κείμενο -->
            <div class="flex items-center justify-end p-12 md:p-24">
                <div class="max-w-md text-center md:text-right">
                    <h2 class="text-xl font-bold tracking-widest uppercase mb-4">{{ editorSettings.title }}
                    </h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">{{ editorSettings.description }}</p>
                    <Link :href="editorSettings.button_link">
                        <Button :label="editorSettings.button_text" class="!bg-black !text-white !rounded-none !px-8" />
                    </Link>
                </div>
            </div>
            <!-- Εικόνα -->
            <div class="w-full h-[300px] md:h-[400px]">
                <img :src="editorSettings.image" class="w-full h-full object-cover" />
            </div>
        </div>
    </section>

    <!-- Curated Lists Section -->
    <section class="py-16 px-4 md:px-8 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl md:text-4xl mb-12 text-center tracking-widest uppercase text-gray-900">
                Curated by Art Collectors
            </h2>

            <!-- Grid 3 στηλών (Αυξήσαμε το gap σε 8 για να "αναπνέουν" τα κείμενα κάτω από τις εικόνες) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                <!-- Loop στις πρώτες 21 λίστες -->
                <div v-for="list in curatedLists.slice(0, 21)" :key="list.list_id" class="w-full">
                    <Link :href="route('lists.show', { slug: list.slug })" class="block group no-underline">

                        <!-- Image Container (Αυστηρά τετράγωνο, με κενό στο κάτω μέρος) -->
                        <div class="relative w-full aspect-square overflow-hidden bg-gray-100 mb-4">
                            <div class="absolute inset-0 bg-cover bg-center"
                                :style="{ backgroundImage: `url(${list.cover || '/images/placeholder.png'})` }">
                            </div>
                        </div>

                        <!-- Content Container (Κάτω από την εικόνα, Σκούρα και Έντονα γράμματα) -->
                        <div class="w-full text-left">
                            <h3 class="text-gray-900 text-lg text-center md:text-xl font-bold tracking-wider mb-2">
                                {{ list.name }}
                            </h3>
                        </div>

                    </Link>
                </div>

            </div>
        </div>
    </section>

    <!-- Browse Collections Banner -->
    <section class="w-full bg-[#EAE6D7] py-8 border-y border-gray-200">
        <div class="flex justify-center items-center">
            <Link href="/collections" class="block">
                <button
                    class="px-8 py-3 border border-black rounded-full bg-transparent hover:bg-black hover:text-white transition-colors duration-300 font-medium text-lg tracking-wide cursor-pointer">
                    Browse all our Collections here
                </button>
            </Link>
        </div>
    </section>

    <!-- Recently Viewed Items Section -->
    <section class="py-16 px-4 md:px-8 bg-white">
        <div class="max-w-7xl mx-auto">

            <h2 class="text-2xl md:text-3xl mb-12 text-center tracking-widest text-gray-900">
                Recently Viewed Items
            </h2>

            <!-- PrimeVue Carousel -->
            <Carousel :value="recentlyViewed" :numVisible="4" :numScroll="1"
                :responsiveOptions="carouselResponsiveOptions" circular>
                <!-- Template για το κάθε artwork -->
                <template #item="slotProps">
                    <div class="p-2"> <!-- p-2 για να υπάρχει ένα μικρό κενό μεταξύ των καρτών του carousel -->
                        <div class="rounded flex flex-col artwork-container">
                            <Link :href="route('artwork.details', {
                                id: slotProps.data.pictufy_id || slotProps.data.artwork_id,
                                slug: slugify(typeof slotProps.data.title === 'string' ? slotProps.data.title : (slotProps.data.title?.en || 'artwork'))
                            })" class="artwork-link">
                                <div class="relative">
                                    <img :src="slotProps.data.image || slotProps.data.thumb || '/images/placeholder.png'"
                                        :alt="typeof slotProps.data.title === 'string' ? slotProps.data.title : (slotProps.data.title?.en || 'Untitled')"
                                        class="rounded w-full h-auto object-contain max-h-[300px]" />

                                    <div class="artwork-overlay">
                                        <div class="overlay-content">
                                            <span class="artwork-title">
                                                {{ typeof slotProps.data.title === 'string' ? slotProps.data.title :
                                                (slotProps.data.title?.en || 'Untitled') }}
                                            </span>
                                            <Divider layout="vertical" />
                                            <span class="artwork-id">ID: {{ slotProps.data.pictufy_id ||
                                                slotProps.data.artwork_id }}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </template>
            </Carousel>

        </div>
    </section>

    <!-- Clients and Projects Section -->
    <section class="clients-section py-16">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-3xl text-center mb-12 tracking-widest">Clients and Projects</h2>
            <div
                class="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <img src="/images/clients/hilton.png" alt="Hilton" class="h-12" />
                <img src="/images/clients/the-royal-senses.png" alt="The Royal Senses" class="h-12" />
                <img src="/images/clients/kakkos-bay.png" alt="Kakkos Bay" class="h-12" />
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <!-- <section class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
            <Link :href="route(feature.route)" class="feature-link">
                <div class="feature-image-wrapper">
                    <img :src="feature.image" :alt="feature.title" class="feature-image" />
                </div>
                <div class="feature-content">
                    <h2 class="feature-title">{{ feature.title }}</h2>
                    <p class="feature-description">{{ feature.description }}</p>
                </div>
            </Link>
        </div>
    </section> -->
</template>

<style scoped>
/* =========================================
   1. HERO SECTION (Existing Styles)
   ========================================= */
.hero-section {
    background-image: url('/public/images/hero-bg.jpg.webp');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center top;
    background-color: transparent;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    padding: 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

/* =========================================
   2. SECONDARY BANNER ("Timeless Art")
   ========================================= */
.secondary-banner {
    margin: 2rem auto 4rem;
    padding: 0 2rem;
    max-width: 1200px;
}

.promo-banner-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    height: 300px;
    /* Fixed height for the strip */
}

/* Gradient overlay for the promo banner */
.promo-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
    display: flex;
    align-items: center;
    padding-left: 4rem;
}

.promo-banner-title {
    color: white;
    font-family: serif;
    font-size: 3rem;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin: 0;
}

/* =========================================
   3. TRUST ICONS SECTION
   ========================================= */
.trust-icons-section {
    background-color: #f9fafb;
    /* Light gray bg */
    padding: 4rem 2rem;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
}

.trust-subtitle {
    text-align: center;
    font-size: 1.25rem;
    color: #4b5563;
    font-style: italic;
    margin-bottom: 3rem;
    font-weight: 500;
}

.icons-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.icon-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.icon-box i {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color, #3B82F6);
}

.icon-text {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    color: #374151;
}

/* =========================================
   4. CURATED LISTS (Grid Layout)
   ========================================= */


/* =========================================
   5. CLIENTS SECTION
   ========================================= */
.clients-section {
    padding: 4rem 2rem;
    background-color: white;
}

.clients-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    margin-top: 2rem;
}

.client-logo {
    height: 3rem;
    width: auto;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all 0.3s ease;
}

.client-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
}

/* =========================================
   6. MEDIA QUERIES
   ========================================= */
@media (min-width: 768px) {
    .icons-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.25rem;
    }

    .promo-banner-title {
        font-size: 2rem;
        padding-left: 0;
        /* Adjust for mobile if needed */
    }

    .promo-banner-overlay {
        padding-left: 2rem;
    }

    .curated-banner-link {
        height: 250px;
    }

    .curated-banner-content {
        padding: 1.5rem;
    }

    .curated-banner-title {
        font-size: 1.75rem;
    }
}

/* --- 5. Recently Viewed & Artworks Style (From Artworks.vue) --- */
.recent-section {
    padding: 4rem 2rem;
    background-color: #fff;
    border-top: 1px solid #f3f4f6;
}

.artwork-container {
    position: relative;
    overflow: hidden;
    padding: 0.5rem;
    border-radius: 6px;
    transition: transform 0.3s ease;
}

.artwork-container:hover {
    /* transform: translateY(-5px);
     Gentle lift effect */
}

.artwork-link {
    display: block;
    width: 100%;
    text-align: center;
}

.artwork-container img {
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    /* border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.artwork-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem;
    transform: translateY(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    border-top: 1px solid #eee;
}

.artwork-container:hover .artwork-overlay {
    transform: translateY(0);
    opacity: 1;
}

.overlay-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    color: #333;
}

.artwork-id,
.artwork-title {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artwork-title {
    flex-grow: 1;
    text-align: left;
}

.artwork-id {
    flex-shrink: 0;
    color: #555;
}
</style>