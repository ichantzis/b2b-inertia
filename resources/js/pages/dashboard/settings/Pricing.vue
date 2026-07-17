<template>
    <InertiaHead title="Settings" />
    <Container>
        <PageTitleSection title="Price Settings" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Διαχείριση Εκπτώσεων Πελατών (Tiers) -->
            <Card class="mb-6">
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-xl text-primary"></i>
                            <span>Customer Pricing Tiers</span>
                        </div>
                        <Button label="Add Tier" icon="pi pi-plus" size="small" @click="openTierDialog()" />
                    </div>
                </template>
                <template #content>
                    <DataTable :value="pricingTiers" responsiveLayout="scroll" class="p-datatable-sm">
                        <Column field="name" header="Tier Name"></Column>
                        <Column field="discount_percentage" header="Discount">
                            <template #body="slotProps">
                                <span class="font-bold text-green-600">{{ slotProps.data.discount_percentage }}% OFF</span>
                            </template>
                        </Column>
                        <Column header="Actions" alignFrozen="right">
                            <template #body="slotProps">
                                <div class="flex gap-2">
                                    <Button icon="pi pi-pencil" text rounded severity="info" @click="openTierDialog(slotProps.data)" />
                                    <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDeleteTier(slotProps.data)" />
                                </div>
                            </template>
                        </Column>
                        <template #empty>
                            <div class="text-center p-4 text-gray-500">
                                No custom pricing tiers found. All users are currently on default pricing.
                            </div>
                        </template>
                    </DataTable>
                </template>
            </Card>

            <!-- Dialog για Δημιουργία / Επεξεργασία Tier -->
            <Dialog v-model:visible="tierDialog" :header="tierForm.id ? 'Edit Pricing Tier' : 'New Pricing Tier'" :modal="true" :style="{ width: '400px' }">
                <div class="flex flex-col gap-4 mt-4">
                    <div class="field">
                        <label for="tier_name" class="block font-medium mb-1">Tier Name</label>
                        <InputText id="tier_name" v-model="tierForm.name" class="w-full" placeholder="e.g. Gold Partners" :class="{ 'p-invalid': tierForm.errors.name }" />
                        <small v-if="tierForm.errors.name" class="p-error">{{ tierForm.errors.name }}</small>
                    </div>
                    
                    <div class="field">
                        <label for="discount" class="block font-medium mb-1">Discount Percentage (%)</label>
                        <div class="p-inputgroup flex-1">
                            <InputText id="discount" 
                                       type="number" 
                                       step="0.01" 
                                       min="0" 
                                       max="100" 
                                       v-model.number="tierForm.discount_percentage" 
                                       class="w-full" 
                                       :class="{ 'p-invalid': tierForm.errors.discount_percentage }" />
                        </div>
                        <small v-if="tierForm.errors.discount_percentage" class="p-error">{{ tierForm.errors.discount_percentage }}</small>
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="tierDialog = false" />
                    <Button label="Save Tier" icon="pi pi-check" :loading="tierForm.processing" @click="submitTier" />
                </template>
            </Dialog>

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
import { useConfirm } from 'primevue/useconfirm';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head as InertiaHead } from '@inertiajs/vue3';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import PricingListEditor from '@/components/dashboard/PricingListEditor.vue';

defineOptions({
    layout: AdminLayout
});

const props = defineProps({
    settings: Object,
    pricingTiers: Array
});

const toast = useToast();

const confirm = useConfirm();

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

// --- Λογική για Pricing Tiers ---
const tierDialog = ref(false);

const tierForm = useForm({
    id: null,
    name: '',
    discount_percentage: 0
});

// Άνοιγμα Dialog για Προσθήκη ή Επεξεργασία
const openTierDialog = (tier = null) => {
    tierForm.clearErrors();
    if (tier) {
        tierForm.id = tier.id;
        tierForm.name = tier.name;
        // Το InputNumber του PrimeVue θέλει αριθμό, όχι string
        tierForm.discount_percentage = Number(tier.discount_percentage); 
    } else {
        tierForm.id = null;
        tierForm.name = '';
        tierForm.discount_percentage = 0;
    }
    tierDialog.value = true;
};

// Υποβολή Φόρμας
const submitTier = () => {
    if (tierForm.id) {
        // Επεξεργασία (PUT)
        tierForm.put(route('dashboard.settings.pricing-tiers.update', tierForm.id), {
            preserveScroll: true,
            onSuccess: () => { tierDialog.value = false; }
        });
    } else {
        // Δημιουργία (POST)
        tierForm.post(route('dashboard.settings.pricing-tiers.store'), {
            preserveScroll: true,
            onSuccess: () => { tierDialog.value = false; }
        });
    }
};

// Διαγραφή
const confirmDeleteTier = (tier) => {
    confirm.require({
        message: `Are you sure you want to delete the "${tier.name}" tier? Users in this tier will revert to default pricing.`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            router.delete(route('dashboard.settings.pricing-tiers.destroy', tier.id), {
                preserveScroll: true
            });
        }
    });
};

</script>