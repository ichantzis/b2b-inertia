<template>
    <InertiaHead title="Settings" />
    <Container>
        <PageTitleSection title="Price Settings" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card class="lg:col-span-2 overflow-hidden">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-tags text-xl"></i>
                        <span>Artwork Price Lists</span>
                    </div>
                </template>
                <template #content>
                    <div class="overflow-x-auto">
                        <Tabs value="canvas_framed">
                            <TabList>
                                <Tab value="canvas_framed">Canvas (Framed)</Tab>
                                <Tab value="canvas_noframe">Canvas (No Frame)</Tab>
                                <Tab value="poster_framed">Poster (Framed)</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel value="canvas_framed">
                                    <PricingListEditor v-model="pricingForm.pricing_config.canvas_framed"
                                        :is-saving="pricingForm.processing" :show-oil-price="true"
                                        @save="(msg) => submitPricing(msg)" />
                                </TabPanel>
                                <TabPanel value="canvas_noframe">
                                    <PricingListEditor v-model="pricingForm.pricing_config.canvas_noframe"
                                        :is-saving="pricingForm.processing" :show-oil-price="true"
                                        @save="(msg) => submitPricing(msg)" />
                                </TabPanel>
                                <TabPanel value="poster_framed">
                                    <PricingListEditor v-model="pricingForm.pricing_config.poster_framed"
                                        :is-saving="pricingForm.processing" :show-oil-price="false"
                                        @save="(msg) => submitPricing(msg)" />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </div>
                </template>
                <template #footer>
                    <div class="flex justify-end">
                        <Button label="Save Prices" icon="pi pi-save" severity="success" size="small"
                            :loading="pricingForm.processing" @click="submitPricing" />
                    </div>
                </template>
            </Card>

        </div>
    </Container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import { useToast } from 'primevue/usetoast';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import PricingListEditor from '@/components/dashboard/PricingListEditor.vue';

defineOptions({
    layout: AdminLayout
});

const props = defineProps({
    settings: Object
});

const toast = useToast();

// ----------------------------------------------------------------
// 1. Pricing Configuration (Auto-Save Logic)
// ----------------------------------------------------------------
const pricingForm = useForm({
    pricing_config: props.settings.pricing_config || {},
});

const submitPricing = (message = 'Price list saved.') => {
    const successMessage = typeof message === 'string' ? message : 'Price list saved.';

    pricingForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
            pricingForm.pricing_config = page.props.settings.pricing_config;
            pricingForm.defaults({
                pricing_config: page.props.settings.pricing_config,
            });
            toast.add({ severity: 'success', summary: 'Updated', detail: successMessage, life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save prices.', life: 3000 });
        }
    });
};

</script>