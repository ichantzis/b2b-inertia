<template>
    <AdminLayout>
        <InertiaHead title="Settings" />
        <Container>
            <PageTitleSection title="Settings" />
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <Card class="h-full">
                    <template #title>
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
                                <InputText id="admin_email" v-model="emailForm.admin_notification_email" class="w-full"
                                    placeholder="admin@example.com" />
                            </span>
                            <small class="text-gray-500 block mt-1">Order notifications are sent here.</small>
                            <div v-if="emailForm.errors.admin_notification_email" class="text-red-500 text-xs mt-1">
                                {{ emailForm.errors.admin_notification_email }}
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex justify-end">
                            <Button label="Save Email" icon="pi pi-check" size="small" 
                                :loading="emailForm.processing" 
                                @click="submitEmail" />
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
                            <ToggleSwitch v-model="toggles.require_login_for_prices" 
                                @change="updateToggle('require_login_for_prices')" />
                        </div>
                        <Divider />
                        <div class="flex items-center justify-between p-2 rounded">
                            <div class="mr-4">
                                <div class="font-medium text-gray-800">Open Public Registration</div>
                                <div class="text-sm text-gray-500">
                                    If disabled, guests request access.
                                </div>
                            </div>
                            <ToggleSwitch v-model="toggles.allow_public_registration" 
                                @change="updateToggle('allow_public_registration')" />
                        </div>
                    </template>
                </Card>

                <Card class="h-full">
                    <template #title>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-cloud-download text-xl"></i>
                            <span>Pictufy Sync Operations</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between border-b pb-3 border-gray-100">
                                <div>
                                    <div class="font-medium text-gray-800">Sync Recent Artworks</div>
                                    <div class="text-xs text-gray-500">Fetches latest 200 items</div>
                                </div>
                                <Button label="Run Sync" icon="pi pi-refresh" size="small" 
                                    :loading="processingCommand === 'sync_recent'" 
                                    @click="runCommand('sync_recent')" />
                            </div>

                            <div class="flex items-center justify-between border-b pb-3 border-gray-100">
                                <div>
                                    <div class="font-medium text-gray-800">Update Ranks</div>
                                    <div class="text-xs text-gray-500">Updates Trending, Best Selling & Recommended</div>
                                </div>
                                <Button label="Update Ranks" icon="pi pi-chart-line" severity="secondary" size="small"
                                    :loading="processingCommand === 'update_ranks'" 
                                    @click="runCommand('update_ranks')" />
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium text-gray-800">Prune Expired</div>
                                    <div class="text-xs text-gray-500">Removes artworks with expired licenses</div>
                                </div>
                                <Button label="Prune" icon="pi pi-trash" severity="danger" size="small" outlined
                                    :loading="processingCommand === 'prune_expired'" 
                                    @click="runCommand('prune_expired')" />
                            </div>
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
                                        <PricingListEditor 
                                            v-model="pricingForm.pricing_config.canvas_framed" 
                                            :is-saving="pricingForm.processing"
                                            @save="(msg) => submitPricing(msg)"
                                        />
                                    </TabPanel>
                                    <TabPanel value="canvas_noframe">
                                        <PricingListEditor 
                                            v-model="pricingForm.pricing_config.canvas_noframe" 
                                            :is-saving="pricingForm.processing"
                                            @save="(msg) => submitPricing(msg)"
                                        />
                                    </TabPanel>
                                    <TabPanel value="poster_framed">
                                        <PricingListEditor 
                                            v-model="pricingForm.pricing_config.poster_framed" 
                                            :is-saving="pricingForm.processing"
                                            @save="(msg) => submitPricing(msg)"
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
                    </template>
                </Card>

            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Divider from 'primevue/divider';
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

// ----------------------------------------------------------------
// 1. Toggles (Auto-Save)
// ----------------------------------------------------------------
const toggles = reactive({
    require_login_for_prices: !!props.settings.require_login_for_prices,
    allow_public_registration: !!props.settings.allow_public_registration,
});

const updateToggle = (key) => {
    router.post(route('dashboard.settings.update'), {
        [key]: toggles[key]
    }, {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Setting updated.', life: 3000 });
        },
        onError: () => {
            toggles[key] = !toggles[key];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update setting.', life: 3000 });
        }
    });
};

// ----------------------------------------------------------------
// 2. Admin Email Form
// ----------------------------------------------------------------
const emailForm = useForm({
    admin_notification_email: props.settings.admin_notification_email || '',
});

const submitEmail = () => {
    emailForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Admin email updated.', life: 3000 });
        }
    });
};

// ----------------------------------------------------------------
// 3. Pricing Configuration (Auto-Save Logic)
// ----------------------------------------------------------------
const pricingForm = useForm({
    pricing_config: props.settings.pricing_config || {},
});

// Now accepts a custom success message
const submitPricing = (successMessage = 'Price list saved.') => {
    pricingForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
            // Update local data with server sorted/processed data
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

// ----------------------------------------------------------------
// 4. Artisan Commands
// ----------------------------------------------------------------
const processingCommand = ref(null);

const runCommand = (key) => {
    processingCommand.value = key;
    
    router.post(route('dashboard.settings.command'), { 
        command_key: key 
    }, {
        preserveScroll: true,
        onFinish: () => {
            processingCommand.value = null;
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.', life: 3000 });
        }
    });
};
</script>