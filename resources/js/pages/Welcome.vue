<script setup>
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import { usePage, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';

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

</script>

<template>
    <InertiaHead title="Home" />

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

    <!-- Features Grid -->
    <section class="features-grid">
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
    </section>
</template>

<style scoped>
.hero-section {
    background-image: url('/public/images/hero-bg.jpg.png');
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

.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-4px);
}

.feature-image-wrapper {
    aspect-ratio: 16/9;
    overflow: hidden;
}

.feature-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.feature-card:hover .feature-image {
    transform: scale(1.05);
}

.feature-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.feature-description {
    font-size: 1rem;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .features-grid {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.25rem;
    }
}
</style>
