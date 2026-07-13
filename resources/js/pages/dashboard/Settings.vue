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
                            <Button label="Save Email" icon="pi pi-check" size="small" :loading="emailForm.processing"
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

                <!-- Hero Banner Settings Card -->
                <Card class="lg:col-span-2 overflow-hidden border border-gray-200 shadow-sm">
                    <template #title>
                        <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <i class="pi pi-image text-xl text-primary"></i>
                            <span class="font-bold text-gray-800">Hero Banner Configuration</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                            <!-- Αριστερή Στήλη: Κείμενα -->
                            <div class="flex flex-col gap-4">
                                <div class="field">
                                    <label for="hero_title" class="block font-medium mb-1 text-sm text-gray-700">Hero
                                        Title</label>
                                    <InputText id="hero_title" v-model="heroForm.hero_title"
                                        class="w-full p-inputtext-sm" />
                                </div>
                                <div class="field">
                                    <label for="hero_subtitle" class="block font-medium mb-1 text-sm text-gray-700">Hero
                                        Subtitle</label>
                                    <InputText id="hero_subtitle" v-model="heroForm.hero_subtitle"
                                        class="w-full p-inputtext-sm" />
                                </div>

                                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-100">
                                    <div class="field">
                                        <label for="hero_button1_text"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button 1 Text</label>
                                        <InputText id="hero_button1_text" v-model="heroForm.hero_button1_text"
                                            class="w-full p-inputtext-sm" />
                                    </div>
                                    <div class="field">
                                        <label for="hero_button1_link"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button 1 Link</label>
                                        <InputText id="hero_button1_link" v-model="heroForm.hero_button1_link"
                                            class="w-full p-inputtext-sm" />
                                    </div>
                                    <div class="field">
                                        <label for="hero_button2_text"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button 2 Text</label>
                                        <InputText id="hero_button2_text" v-model="heroForm.hero_button2_text"
                                            class="w-full p-inputtext-sm" />
                                    </div>
                                    <div class="field">
                                        <label for="hero_button2_link"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button 2 Link</label>
                                        <InputText id="hero_button2_link" v-model="heroForm.hero_button2_link"
                                            class="w-full p-inputtext-sm" />
                                    </div>
                                </div>
                            </div>

                            <!-- Δεξιά Στήλη: Διαχείριση Εικόνας & Thumbnail -->
                            <div class="flex flex-col gap-4">
                                <div class="field">
                                    <label for="hero_image" class="block font-medium mb-1 text-sm text-gray-700">Update
                                        Background Image</label>
                                    <input type="file" id="hero_image"
                                        @input="heroForm.hero_image = $event.target.files[0]"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded cursor-pointer"
                                        accept="image/*" />
                                    <small class="text-gray-500 mt-1 block">Leave empty to keep current image.
                                        Recommended size: 1920x1080px.</small>
                                </div>

                                <!-- Προβολή τρέχουσας εικόνας (Thumbnail) -->
                                <div v-if="props.settings.hero_image"
                                    class="p-3 bg-gray-50 rounded border border-gray-200 flex flex-col gap-2">
                                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current
                                        Image Preview</span>
                                    <div
                                        class="w-full h-40 overflow-hidden rounded border border-gray-300 shadow-inner bg-white flex items-center justify-center">
                                        <img :src="props.settings.hero_image" alt="Current Hero Banner"
                                            class="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex justify-end pt-4 border-t border-gray-100">
                            <Button label="Save Hero Settings" icon="pi pi-save" size="small"
                                :loading="heroForm.processing" @click="submitHeroSettings" />
                        </div>
                    </template>
                </Card>

                <!-- Featured Columns (3 Images Layout) Card -->
                <Card class="lg:col-span-2 overflow-hidden border border-gray-200 shadow-sm mt-6">
                    <template #title>
                        <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <i class="pi pi-th-large text-xl text-primary"></i>
                            <span class="font-bold text-gray-800">Featured Layout (3 Columns)</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

                            <!-- Στήλη 1 -->
                            <div class="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h4 class="font-bold text-gray-800 border-b border-gray-200 pb-2">Column 1</h4>

                                <!-- Thumbnail -->
                                <div v-if="props.settings.col1_image"
                                    class="w-full aspect-[4/5] rounded overflow-hidden shadow-sm border border-gray-300 mb-2">
                                    <img :src="props.settings.col1_image" class="w-full h-full object-cover"
                                        alt="Col 1" />
                                </div>

                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Image</label>
                                    <input type="file" id="col1_image"
                                        @input="columnsForm.col1_image = $event.target.files[0]"
                                        class="w-full text-xs p-1 border border-gray-300 rounded bg-white"
                                        accept="image/*" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Title</label>
                                    <InputText v-model="columnsForm.col1_title" class="w-full p-inputtext-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Link URL</label>
                                    <InputText v-model="columnsForm.col1_link" class="w-full p-inputtext-sm" />
                                </div>
                            </div>

                            <!-- Στήλη 2 -->
                            <div class="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h4 class="font-bold text-gray-800 border-b border-gray-200 pb-2">Column 2</h4>

                                <div v-if="props.settings.col2_image"
                                    class="w-full aspect-[4/5] rounded overflow-hidden shadow-sm border border-gray-300 mb-2">
                                    <img :src="props.settings.col2_image" class="w-full h-full object-cover"
                                        alt="Col 2" />
                                </div>

                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Image</label>
                                    <input type="file" id="col2_image"
                                        @input="columnsForm.col2_image = $event.target.files[0]"
                                        class="w-full text-xs p-1 border border-gray-300 rounded bg-white"
                                        accept="image/*" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Title</label>
                                    <InputText v-model="columnsForm.col2_title" class="w-full p-inputtext-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Link URL</label>
                                    <InputText v-model="columnsForm.col2_link" class="w-full p-inputtext-sm" />
                                </div>
                            </div>

                            <!-- Στήλη 3 -->
                            <div class="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h4 class="font-bold text-gray-800 border-b border-gray-200 pb-2">Column 3</h4>

                                <div v-if="props.settings.col3_image"
                                    class="w-full aspect-[4/5] rounded overflow-hidden shadow-sm border border-gray-300 mb-2">
                                    <img :src="props.settings.col3_image" class="w-full h-full object-cover"
                                        alt="Col 3" />
                                </div>

                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Image</label>
                                    <input type="file" id="col3_image"
                                        @input="columnsForm.col3_image = $event.target.files[0]"
                                        class="w-full text-xs p-1 border border-gray-300 rounded bg-white"
                                        accept="image/*" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Title</label>
                                    <InputText v-model="columnsForm.col3_title" class="w-full p-inputtext-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Link URL</label>
                                    <InputText v-model="columnsForm.col3_link" class="w-full p-inputtext-sm" />
                                </div>
                            </div>

                        </div>
                    </template>
                    <template #footer>
                        <div class="flex justify-end pt-4 border-t border-gray-100">
                            <Button label="Save Columns" icon="pi pi-save" size="small"
                                :loading="columnsForm.processing" @click="submitColumnsSettings" />
                        </div>
                    </template>
                </Card>

                <!-- Editor's Pick Section Card -->
                <Card class="lg:col-span-2 overflow-hidden border border-gray-200 shadow-sm mt-6">
                    <template #title>
                        <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <i class="pi pi-star text-xl text-primary"></i>
                            <span class="font-bold text-gray-800">Editor's Pick Configuration</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                            <!-- Αριστερή Στήλη: Κείμενα & Κουμπί -->
                            <div class="flex flex-col gap-4">
                                <div class="field">
                                    <label for="editor_title"
                                        class="block font-medium mb-1 text-sm text-gray-700">Section Title</label>
                                    <InputText id="editor_title" v-model="editorForm.editor_title"
                                        class="w-full p-inputtext-sm" placeholder="THE EDITOR'S PICK - MAY" />
                                </div>

                                <div class="field">
                                    <label for="editor_description"
                                        class="block font-medium mb-1 text-sm text-gray-700">Description</label>
                                    <textarea id="editor_description" v-model="editorForm.editor_description"
                                        class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                        rows="4" placeholder="Discover the world's top posters...">
                    </textarea>
                                </div>

                                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-100">
                                    <div class="field">
                                        <label for="editor_button_text"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button Text</label>
                                        <InputText id="editor_button_text" v-model="editorForm.editor_button_text"
                                            class="w-full p-inputtext-sm" placeholder="Shop Collection" />
                                    </div>
                                    <div class="field">
                                        <label for="editor_button_link"
                                            class="block font-medium mb-1 text-xs text-gray-600">Button Link</label>
                                        <InputText id="editor_button_link" v-model="editorForm.editor_button_link"
                                            class="w-full p-inputtext-sm" placeholder="/category/editors-pick" />
                                    </div>
                                </div>
                            </div>

                            <!-- Δεξιά Στήλη: Διαχείριση Εικόνας & Thumbnail -->
                            <div class="flex flex-col gap-4">
                                <div class="field">
                                    <label for="editor_image"
                                        class="block font-medium mb-1 text-sm text-gray-700">Update Editor's
                                        Image</label>
                                    <input type="file" id="editor_image"
                                        @input="editorForm.editor_image = $event.target.files[0]"
                                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded cursor-pointer"
                                        accept="image/*" />
                                    <small class="text-gray-500 mt-1 block">Leave empty to keep current image.
                                        Recommended size portrait.</small>
                                </div>

                                <!-- Προβολή τρέχουσας εικόνας (Thumbnail) -->
                                <div v-if="props.settings.editor_image"
                                    class="p-3 bg-gray-50 rounded border border-gray-200 flex flex-col gap-2">
                                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current
                                        Image Preview</span>
                                    <div
                                        class="w-full h-48 overflow-hidden rounded border border-gray-300 shadow-inner bg-white flex items-center justify-center">
                                        <img :src="props.settings.editor_image" alt="Current Editor's Pick"
                                            class="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex justify-end pt-4 border-t border-gray-100">
                            <Button label="Save Editor's Pick" icon="pi pi-save" size="small"
                                :loading="editorForm.processing" @click="submitEditorSettings" />
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
                                    :loading="processingCommand === 'sync_recent'" @click="runCommand('sync_recent')" />
                            </div>

                            <div class="flex items-center justify-between border-b pb-3 border-gray-100">
                                <div>
                                    <div class="font-medium text-gray-800">Update Ranks</div>
                                    <div class="text-xs text-gray-500">Updates Trending, Best Selling & Recommended
                                    </div>
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
// 3. Hero Banner Form (NEW)
// ----------------------------------------------------------------
const heroForm = useForm({
    hero_title: props.settings.hero_title || '',
    hero_subtitle: props.settings.hero_subtitle || '',
    hero_button1_text: props.settings.hero_button1_text || '',
    hero_button1_link: props.settings.hero_button1_link || '',
    hero_button2_text: props.settings.hero_button2_text || '',
    hero_button2_link: props.settings.hero_button2_link || '',
    hero_image: null, // Το πεδίο για το αρχείο
});

const submitHeroSettings = () => {
    heroForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        forceFormData: true, // Πολύ σημαντικό για την αποστολή αρχείων μέσω FormData
        onSuccess: () => {
            // Μηδενίζουμε το αρχείο μετά από επιτυχή αποθήκευση, ώστε να μη ξανασταλεί άσκοπα στο επόμενο save
            heroForm.hero_image = null;
            // Κάνουμε reset και το input type="file" του DOM 
            const fileInput = document.getElementById('hero_image');
            if (fileInput) fileInput.value = '';

            toast.add({ severity: 'success', summary: 'Saved', detail: 'Hero banner settings updated.', life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update hero settings. Check validation errors.', life: 3000 });
        }
    });
};

// ----------------------------------------------------------------
// Three Columns Configuration
// ----------------------------------------------------------------
const columnsForm = useForm({
    col1_title: props.settings.col1_title || '',
    col1_link: props.settings.col1_link || '',
    col1_image: null,

    col2_title: props.settings.col2_title || '',
    col2_link: props.settings.col2_link || '',
    col2_image: null,

    col3_title: props.settings.col3_title || '',
    col3_link: props.settings.col3_link || '',
    col3_image: null,
});

const submitColumnsSettings = () => {
    columnsForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
            columnsForm.col1_image = null;
            columnsForm.col2_image = null;
            columnsForm.col3_image = null;

            // Επαναφορά των input file στο DOM
            ['col1_image', 'col2_image', 'col3_image'].forEach(id => {
                const fileInput = document.getElementById(id);
                if (fileInput) fileInput.value = '';
            });

            toast.add({ severity: 'success', summary: 'Saved', detail: 'Columns settings updated.', life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update columns. Check validation errors.', life: 3000 });
        }
    });
};

// ----------------------------------------------------------------
// Editor's Pick Configuration
// ----------------------------------------------------------------

const editorForm = useForm({
    editor_title: props.settings.editor_title || '',
    editor_description: props.settings.editor_description || '',
    editor_button_text: props.settings.editor_button_text || '',
    editor_button_link: props.settings.editor_button_link || '',
    editor_image: null,
});

const submitEditorSettings = () => {
    editorForm.post(route('dashboard.settings.update'), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
            editorForm.editor_image = null;
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Editor section updated.', life: 3000 });
        }
    });
};

// ----------------------------------------------------------------
// 4. Pricing Configuration (Auto-Save Logic)
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

// ----------------------------------------------------------------
// 5. Artisan Commands
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