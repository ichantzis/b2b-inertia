import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h, ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import customThemePreset from '@/theme/noir-preset';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .use(ZiggyVue, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                })
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
                .use(ConfirmationService)
                // Mock useDark for SSR since window/localStorage is unavailable
                .provide('darkMode', ref(false)) 
                .component('InertiaHead', Head)
                .component('InertiaLink', Link)
                .component('Container', Container)
                .component('PageTitleSection', PageTitleSection);
        },
    })
);