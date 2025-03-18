import '../css/app.css';
import '../css/tailwind.css';
import 'primeicons/primeicons.css';

import { createApp, h } from 'vue';
import { createInertiaApp, Head, Link } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';

import customThemePreset from '@/theme/noir-preset';
import { useDark } from '@vueuse/core';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const darkMode = useDark(); // sets Light/Dark Mode

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob('./pages/**/*.vue')
        ),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .provide('darkMode', darkMode)
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(PrimeVue, {
                theme: {
                    preset: customThemePreset,
                    options: {
                        darkModeSelector: '.dark',
                        cssLayer: {
                            name: 'primevue',
                            order: 'tailwind-theme, tailwind-base, primevue, tailwind-utilities',
                        },
                    },
                },
            })
            .use(ToastService)
            .component('InertiaHead', Head)
            .component('InertiaLink', Link)
            .component('Container', Container)
            .component('PageTitleSection', PageTitleSection)
            .mount(el);
    },
    progress: {
        color: 'var(--p-primary-500)',
    },
});
