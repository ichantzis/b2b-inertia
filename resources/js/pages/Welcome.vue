<script setup>
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import { usePage, Link, Head as InertiaHead } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
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
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">
                Welcome to <span class="text-primary">Pinakothiki</span>
            </h1>
            <p class="hero-subtitle">
                Unique artwork curated for B2B partners
            </p>
            <div class="hero-actions">
                <Link :href="route('collections.index')">
                    <Button label="Explore Collections" icon="pi pi-images" class="p-button-lg" />
                </Link>
            </div>
        </div>
    </section>

    <!-- Secondary Banner -->
    <section class="secondary-banner my-8 px-4">
        <div class="promo-banner-container relative rounded-xl overflow-hidden shadow-lg">
            <img src="/images/banner2.webp" alt="Timeless Art" class="w-full object-cover h-[300px]" />
            <div class="absolute inset-0 bg-black/20 flex flex-col justify-center p-8 text-white">
                <!-- <h2 class="text-4xl font-serif">TIMELESS ART</h2> -->
            </div>
        </div>
    </section>

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

    <!-- Curated Lists Section -->
    <section class="curated-section py-12 px-6">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl mb-8 text-center tracking-widest">
                Curated by Art Collectors
            </h2>

            <div class="curated-list-container">
                <div v-for="list in curatedLists" :key="list.list_id" class="curated-banner-item">
                    <Link :href="route('lists.show', { slug: list.slug })" class="curated-banner-link group">

                        <div class="image-wrapper">
                            <img :src="list.cover || '/images/placeholder.png'" :alt="list.name"
                                class="curated-banner-image" loading="lazy" />
                        </div>

                        <div class="curated-banner-overlay"></div>

                        <div class="curated-banner-content">
                            <h3 class="curated-banner-title">
                                {{ list.name }}
                            </h3>
                            <span
                                class="view-text group-hover:translate-x-2 transition-transform duration-300 inline-block">
                                View Collection <i class="pi pi-arrow-right text-xs ml-1"></i>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </section>

    <section v-if="recentlyViewed.length > 0" class="recent-section">
        <div class="max-w-7xl mx-auto px-4">
            <h2 class="section-title">Recently Viewed Items</h2>

            <DataView :value="recentlyViewed" layout="grid">
                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4 md:gap-8">
                        <div v-for="(item, index) in slotProps.items" :key="item.pictufy_id || index"
                            class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2">
                            <div class="rounded flex flex-col artwork-container">
                                <Link :href="route('artwork.details', {
                                    id: item.pictufy_id,
                                    slug: slugify(typeof item.title === 'string' ? item.title : (item.title?.en || 'artwork'))
                                })" class="artwork-link">
                                    <div class="relative">
                                        <img :src="item.image || item.thumb || '/images/placeholder.png'"
                                            :alt="typeof item.title === 'string' ? item.title : (item.title?.en || 'Untitled')"
                                            class="rounded w-full h-auto object-contain max-h-[300px]" />

                                        <div class="artwork-overlay">
                                            <div class="overlay-content">
                                                <span class="artwork-title">
                                                    {{ typeof item.title === 'string' ? item.title : (item.title?.en ||
                                                        'Untitled') }}
                                                </span>
                                                <Divider layout="vertical" />
                                                <span class="artwork-id">ID: {{ item.pictufy_id || item.artwork_id }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
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
.curated-section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 3rem;
    letter-spacing: 0.1em;
    color: #333;
}

.curated-list-container {
    display: grid;
    grid-template-columns: 1fr;
    /* Mobile: 1 item per row */
    gap: 2.5rem;
}

/* Tablet & Desktop: 2 items per row */
@media (min-width: 768px) {
    .curated-list-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

.curated-banner-item {
    width: 100%;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.curated-banner-link {
    display: block;
    position: relative;
    width: 100%;
    height: 400px;
    /* Fixed height as requested */
}

.curated-image-wrapper {
    width: 100%;
    height: 100%;
}

.curated-banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
}

.curated-banner-link:hover .curated-banner-image {
    transform: scale(1.05);
}

/* Gradient Overlay */
.curated-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
    pointer-events: none;
}

.curated-banner-content {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 2.5rem;
    width: 100%;
    color: white;
    z-index: 10;
}

.curated-banner-title {
    font-family: serif;
    font-size: 2rem;
    /* Adjusted slightly for 2-col layout */
    font-weight: 400;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.view-text {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

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
    transform: translateY(-5px);
    /* Gentle lift effect */
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
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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