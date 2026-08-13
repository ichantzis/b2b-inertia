<template>
    <InertiaHead title="Manage Lists" />
    <Container>
        <PageTitleSection title="Artwork Lists Management" />

        <Card>
            <template #content>
                <!-- Πίνακας PrimeVue για τις λίστες -->
                <DataTable 
                    :value="localLists" 
                    dataKey="id" 
                    @rowReorder="onRowReorder" 
                    tableStyle="min-width: 50rem"
                >
                    <!-- Η Λαβή (Handle) για το σύρσιμο (ακριβώς όπως στο doc) -->
                    <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false"/>

                    <Column field="name" header="List Name"></Column>

                    <!-- Στήλη προβολής του ενεργού Cover -->
                    <Column header="Cover">
                        <template #body="slotProps">
                            <img :src="slotProps.data.resolved_cover || '/images/placeholder.png'"
                                :alt="slotProps.data.name" 
                                class="w-16 h-16 object-cover rounded shadow-sm select-none cursor-move" />
                        </template>
                    </Column>

                    <Column field="resolved_description" header="Description">
                        <template #body="slotProps">
                            <span class="text-sm text-gray-600 line-clamp-2">
                                {{ slotProps.data.resolved_description || 'No description' }}
                            </span>
                        </template>
                    </Column>

                    <!-- Κουμπί Επεξεργασίας -->
                    <Column header="Actions">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" severity="info" rounded text
                                @click="openEditDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>

        <!-- Modal Επεξεργασίας Λίστας -->
        <Dialog v-model:visible="editDialog" :header="'Edit List: ' + (editingList?.name || '')" :modal="true"
            :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">

            <div class="flex flex-col gap-4 mt-4">
                <!-- Περιγραφή -->
                <div class="field">
                    <label for="description" class="block font-medium mb-1">Custom Description</label>
                    <textarea id="description" v-model="form.custom_description" rows="4"
                        class="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary"
                        placeholder="Leave blank to use default..."></textarea>
                </div>

                <!-- Προβολή τρέχοντος custom εξώφυλλου & Κουμπί Διαγραφής -->
                <div v-if="editingList?.custom_cover_path && !form.remove_custom_cover && !form.custom_cover"
                    class="p-3 bg-gray-50 rounded border border-gray-200 flex flex-col gap-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Custom
                        Cover</span>
                    <div class="flex items-center gap-4">
                        <!-- Δείχνουμε το custom cover -->
                        <img :src="editingList.resolved_cover"
                            class="w-24 h-24 object-cover rounded shadow-sm border border-gray-300" />

                        <Button label="Remove Image" icon="pi pi-trash" severity="danger" text size="small"
                            @click="markCoverForRemoval" />
                    </div>
                    <small class="text-gray-500">Removing this will revert to the default collection cover upon
                        saving.</small>
                </div>

                <!-- Custom Cover Upload -->
                <div class="field">
                    <label class="block font-medium mb-1">Upload New Cover Image</label>
                    <input type="file" id="custom_cover_input"
                        @input="form.custom_cover = $event.target.files[0]; form.remove_custom_cover = false;"
                        accept="image/*"
                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>

                <hr class="my-4 border-gray-200" />

                <!-- Προβολή τρέχοντος custom banner & Κουμπί Διαγραφής -->
                <div v-if="editingList?.custom_banner_path && !form.remove_custom_banner && !form.custom_banner"
                    class="p-3 bg-gray-50 rounded border border-gray-200 flex flex-col gap-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Banner Image</span>
                    <div class="flex flex-col gap-3">
                        <!-- Δείχνουμε το custom banner (με αναλογία που θυμίζει το 1920x400) -->
                        <img :src="'/storage/' + editingList.custom_banner_path"
                            class="w-full h-24 object-cover rounded shadow-sm border border-gray-300" />

                        <Button label="Remove Banner" icon="pi pi-trash" severity="danger" text size="small"
                            class="w-fit" @click="markBannerForRemoval" />
                    </div>
                </div>

                <!-- Custom Banner Upload -->
                <div class="field">
                    <label class="block font-medium mb-1">Upload New Banner Image</label>
                    <input type="file" id="custom_banner_input"
                        @input="form.custom_banner = $event.target.files[0]; form.remove_custom_banner = false;"
                        accept="image/*"
                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                    <small class="text-gray-500 mt-1 block">Recommended size: 1920x400 pixels (Panorama).</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="editDialog = false" />
                <Button label="Save Changes" icon="pi pi-check" :loading="form.processing" @click="submitEdit" />
            </template>
        </Dialog>
    </Container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { useForm, Head as InertiaHead } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';

defineOptions({
    layout: AdminLayout
});

const props = defineProps({
    lists: Array
});

// Τοπικό αντίγραφο των λιστών για να δουλεύει το Drag & Drop οπτικά
const localLists = ref([...props.lists]);

const toast = useToast();
const editDialog = ref(false);
const editingList = ref(null);

const form = useForm({
    custom_description: '',
    custom_cover: null,
    remove_custom_cover: false,
    custom_banner: null,
    remove_custom_banner: false,
});

// Άνοιγμα του modal και φόρτωση των δεδομένων της λίστας
const openEditDialog = (list) => {
    editingList.value = list;
    form.custom_description = list.custom_description || ''; // Φορτώνουμε το υπάρχον custom αν υπάρχει
    form.custom_cover = null;
    form.remove_custom_cover = false; // Επαναφορά του flag σε κάθε νέο άνοιγμα

    // Καθαρισμός του input file αν υπάρχει
    const fileInput = document.getElementById('custom_cover_input');
    if (fileInput) fileInput.value = '';

    form.custom_banner = null;
    form.remove_custom_banner = false;
    const bannerInput = document.getElementById('custom_banner_input');
    if (bannerInput) bannerInput.value = '';

    editDialog.value = true;
};

// Συνάρτηση που καλείται όταν ο χρήστης πατάει "Διαγραφή Εικόνας"
const markCoverForRemoval = () => {
    form.remove_custom_cover = true;
    form.custom_cover = null; // Ακυρώνουμε και τυχόν νέο αρχείο που ίσως είχε επιλέξει

    const fileInput = document.getElementById('custom_cover_input');
    if (fileInput) fileInput.value = '';
};

const markBannerForRemoval = () => {
    form.remove_custom_banner = true;
    form.custom_banner = null;
    const fileInput = document.getElementById('custom_banner_input');
    if (fileInput) fileInput.value = '';
};

// Υποβολή της φόρμας
const submitEdit = () => {
    // Στέλνουμε POST request στο route ενημέρωσης
    form.post(route('dashboard.settings.lists.update', editingList.value.id), {
        preserveScroll: true,
        forceFormData: true, // Απαραίτητο για το upload αρχείων (εικόνας)
        onSuccess: () => {
            editDialog.value = false;
            toast.add({ severity: 'success', summary: 'Saved', detail: 'List updated successfully.', life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update list.', life: 3000 });
        }
    });
};

// Η συνάρτηση που τρέχει μόλις ο admin αφήσει τη γραμμή (drag end)
const onRowReorder = (event) => {
    // 1. Ενημερώνουμε την οθόνη με τη νέα σειρά που μας δίνει το event του PrimeVue
    localLists.value = event.value;

    // 2. Μαζεύουμε μόνο τα ID με τη νέα τους σειρά
    const orderedIds = event.value.map(list => list.id);

    // 3. Στέλνουμε τη νέα σειρά στο backend
    router.post(route('dashboard.settings.lists.reorder'), { ids: orderedIds }, {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Reordered', detail: 'The new order has been saved.', life: 3000 });
        },
        onError: () => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Could not save the new order.', life: 3000 });
        }
    });
};

// Αν αλλάξουν τα δεδομένα από το backend, ενημερώνουμε το τοπικό αντίγραφο
watch(() => props.lists, (newVal) => {
    localLists.value = [...newVal];
});
</script>