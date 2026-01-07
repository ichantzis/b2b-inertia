<template>
    <AdminLayout>
        <InertiaHead title="Settings" />
        <Container>
            <PageTitleSection title="Settings" />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <Card class="h-full"> <template #title>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-cog text-xl"></i>
                            <span>General Configuration</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="field">
                            <label for="admin_email" class="block font-medium mb-2 text-gray-700">
                                Admin Notification Email
                            </label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-envelope" />
                                <InputText id="admin_email" v-model="form.admin_notification_email" class="w-full"
                                    placeholder="admin@example.com" />
                            </span>
                            <small class="text-gray-500 block mt-1">Order notifications are sent here.</small>
                        </div>
                    </template>
                </Card>

                <Card class="h-full">
                    <template #title>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-lock text-xl"></i>
                            <span>Access Control</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="flex items-center justify-between p-2 rounded">
                            <div class="mr-4">
                                <div class="font-medium text-gray-800">Hide Prices for Guests</div>
                                <div class="text-sm text-gray-500">
                                    Users must log in to view prices/cart.
                                </div>
                            </div>
                            <ToggleSwitch v-model="form.require_login_for_prices" />
                        </div>
                        <Divider />
                        <div class="flex items-center justify-between p-2 rounded">
                            <div class="mr-4">
                                <div class="font-medium text-gray-800">Open Public Registration</div>
                                <div class="text-sm text-gray-500">
                                    If disabled, guests request access.
                                </div>
                            </div>
                            <ToggleSwitch v-model="form.allow_public_registration" />
                        </div>
                    </template>
                </Card>

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
                                        <PricingListEditor v-model="form.pricing_config.canvas_framed" />
                                    </TabPanel>
                                    <TabPanel value="canvas_noframe">
                                        <PricingListEditor v-model="form.pricing_config.canvas_noframe" />
                                    </TabPanel>
                                    <TabPanel value="poster_framed">
                                        <PricingListEditor v-model="form.pricing_config.poster_framed" />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
                    </template>
                </Card>

                <div class="lg:col-span-2 mt-4 flex justify-end">
                    <Button @click="submitAll" label="Save All Changes" icon="pi pi-check" :loading="form.processing"
                        size="large" />
                </div>

            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head } from '@inertiajs/vue3';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import ToggleSwitch from 'primevue/toggleswitch';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import { useToast } from 'primevue/usetoast';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import PricingListEditor from '@/components/dashboard/PricingListEditor.vue';

const props = defineProps({
    settings: Object
});

const toast = useToast();

const form = useForm({
    admin_notification_email: props.settings.admin_notification_email || '',
    require_login_for_prices: props.settings.require_login_for_prices || false,
    allow_public_registration: props.settings.allow_public_registration || false,
    pricing_config: props.settings.pricing_config || { materials: [], frames: [] },
});

const submitAll = () => {
    form.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        preserveState: true, // Keep the page state (scroll position etc)
        onSuccess: (page) => {
            // 1. FORCE UPDATE: Overwrite form data with the fresh sorted list from server
            form.pricing_config = page.props.settings.pricing_config;

            // 2. RESET DIRTY STATE: Tell Inertia this new data is the "clean" state
            form.defaults({
                admin_notification_email: page.props.settings.admin_notification_email,
                require_login_for_prices: page.props.settings.require_login_for_prices,
                pricing_config: page.props.settings.pricing_config,
            });

            // 3. MANUAL TOAST: Trigger it here so it works every time, even if message is same
            // toast.add({ 
            //     severity: 'success', 
            //     summary: 'Success', 
            //     detail: 'Settings saved and sorted successfully.', 
            //     life: 3000 
            // });
        },
        onError: () => {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please check the form for errors.',
                life: 3000
            });
        }
    });
};
</script>