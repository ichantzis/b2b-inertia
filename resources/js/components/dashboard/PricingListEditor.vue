<template>
    <div>
        <div class="grid grid-cols-12 gap-4 mb-2 font-semibold text-gray-500 text-sm px-2">
            <div class="col-span-5">Size (WxH)</div>
            <div class="col-span-5">Price (€)</div>
            <div class="col-span-2 text-center">Action</div>
        </div>

        <template v-for="(item, index) in modelValue" :key="index">
            
            <div v-if="shouldShowDivider(index)" class="col-span-12 flex items-center gap-4 my-4">
                <Divider align="left" type="solid" class="m-0">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Square Sizes</span>
                </Divider>
            </div>

            <div class="grid grid-cols-12 gap-4 mb-2 items-center">
                <div class="col-span-5">
                    <InputText 
                        v-model="item.size" 
                        placeholder="WxH (e.g. 40x60)" 
                        class="w-full p-inputtext-sm"
                        :class="{ 'p-invalid': errors[index] }"
                        @blur="handleSizeBlur(index)"
                        @input="errors[index] = null" 
                    />
                    <small v-if="errors[index]" class="text-red-500 text-xs block mt-1">
                        {{ errors[index] }}
                    </small>
                </div>

                <div class="col-span-5">
                    <InputNumber 
                        v-model="item.price" 
                        mode="currency" 
                        currency="EUR" 
                        locale="el-GR"
                        class="w-full p-inputtext-sm"
                        :min="0"
                        @blur="emitSave()"
                    />
                </div>

                <div class="col-span-2 text-center">
                    <Button 
                        icon="pi pi-trash" 
                        severity="danger" 
                        text 
                        rounded 
                        @click="openDeleteDialog(index)"
                        aria-label="Remove"
                    />
                </div>
            </div>
        </template>

        <div class="mt-4">
            <Button 
                label="Add New Size" 
                icon="pi pi-plus" 
                size="small" 
                outlined 
                @click="openAddItemDialog" 
            />
        </div>

        <Dialog 
            v-model:visible="isAddDialogVisible" 
            modal 
            header="Add New Size" 
            :style="{ width: '30rem' }"
            :closable="!isSaving"
            :closeOnEscape="!isSaving"
        >
            <div class="flex flex-col gap-4 pt-2">
                <div>
                    <label for="new-size" class="block text-sm font-medium text-gray-700 mb-1">Size (WxH)</label>
                    <InputText 
                        id="new-size"
                        v-model="newItem.size" 
                        placeholder="e.g. 40x60" 
                        class="w-full" 
                        :class="{ 'p-invalid': newItemError }"
                        @input="newItemError = null"
                        autofocus
                        :disabled="isSaving"
                    />
                    <small v-if="newItemError" class="text-red-500 text-xs block mt-1">
                        {{ newItemError }}
                    </small>
                </div>
                <div>
                    <label for="new-price" class="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                    <InputNumber 
                        id="new-price"
                        v-model="newItem.price" 
                        mode="currency" 
                        currency="EUR" 
                        locale="el-GR"
                        class="w-full"
                        :min="0"
                        placeholder="0,00 €"
                        :disabled="isSaving"
                    />
                </div>
            </div>
            <template #footer>
                <Button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    text 
                    @click="isAddDialogVisible = false" 
                    :disabled="isSaving"
                />
                <Button 
                    label="Add" 
                    icon="pi pi-check" 
                    @click="confirmAddItem" 
                    :loading="isSaving"
                />
            </template>
        </Dialog>

        <Dialog 
            v-model:visible="isDeleteDialogVisible" 
            modal 
            header="Confirm Deletion" 
            :style="{ width: '25rem' }"
            :closable="!isSaving"
            :closeOnEscape="!isSaving"
        >
            <div class="flex items-center gap-3 mb-4">
                <i class="pi pi-exclamation-triangle text-red-500 text-3xl"></i>
                <span class="text-gray-700">
                    Are you sure you want to delete this size?
                </span>
            </div>
            
            <template #footer>
                <Button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    text 
                    severity="secondary"
                    @click="isDeleteDialogVisible = false" 
                    :disabled="isSaving"
                />
                <Button 
                    label="Delete" 
                    icon="pi pi-trash" 
                    severity="danger" 
                    @click="confirmDelete" 
                    :loading="isSaving"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { Divider } from 'primevue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    isSaving: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'save']);
const errors = ref({});

// --- Dialog States ---
const isAddDialogVisible = ref(false);
const isDeleteDialogVisible = ref(false);

const newItem = ref({ size: '', price: null });
const newItemError = ref(null);
const itemToDeleteIndex = ref(null);

// --- Watcher for Loading State ---
// This closes the dialogs only when saving finishes successfully
watch(() => props.isSaving, (isNowSaving, wasSaving) => {
    if (wasSaving && !isNowSaving) {
        // Saving finished. Close dialogs if open.
        if (isAddDialogVisible.value) isAddDialogVisible.value = false;
        if (isDeleteDialogVisible.value) isDeleteDialogVisible.value = false;
    }
});

// Helper validation regex
const isValidSize = (s) => /^\d+x\d+$/.test(s);

// Helper to check if square
const isSquare = (s) => {
    if (!isValidSize(s)) return false;
    const [w, h] = s.split('x').map(Number);
    return w === h;
};

// --- Sorting Logic ---
const sortPricingList = (list) => {
    return list.sort((a, b) => {
        if (!isValidSize(a.size) || !isValidSize(b.size)) return 0;

        const [w1, h1] = a.size.split('x').map(Number);
        const [w2, h2] = b.size.split('x').map(Number);
        
        const isSq1 = w1 === h1;
        const isSq2 = w2 === h2;

        if (isSq1 !== isSq2) return isSq1 ? 1 : -1;
        if (w1 !== w2) return w1 - w2;
        return h1 - h2;
    });
};

const shouldShowDivider = (index) => {
    if (index === 0) return false;
    const currentItem = props.modelValue[index];
    const prevItem = props.modelValue[index - 1];
    if (!currentItem || !prevItem) return false;
    const prevIsSquare = isSquare(prevItem.size);
    const currIsSquare = isSquare(currentItem.size);
    return !prevIsSquare && currIsSquare;
};

// Emit save with optional custom message
const emitSave = (message = null) => {
    emit('save', message);
};

const handleSizeBlur = (index) => {
    const item = props.modelValue[index];
    if (!item.size) return;

    const result = processSizeInput(item.size, index);
    
    if (result.error) {
        errors.value[index] = result.error;
        return;
    }

    let newList = [...props.modelValue];
    newList[index] = { ...item, size: result.normalizedSize };
    newList = sortPricingList(newList);

    emit('update:modelValue', newList);
    errors.value = {}; 
    emitSave(); // Default message
};

const processSizeInput = (inputSize, ignoreIndex = -1) => {
    let rawSize = inputSize.toLowerCase().trim();
    if (!rawSize.includes('x')) return { error: "Format must be WxH (e.g. 50x70)" };

    const [d1, d2] = rawSize.split('x').map(n => parseInt(n));
    if (isNaN(d1) || isNaN(d2)) return { error: "Invalid numbers" };

    const w = Math.min(d1, d2);
    const h = Math.max(d1, d2);
    const normalizedSize = `${w}x${h}`;

    const isDuplicate = props.modelValue.some((existingItem, i) => {
        return i !== ignoreIndex && existingItem.size === normalizedSize;
    });

    if (isDuplicate) return { error: "Size already exists" };

    return { normalizedSize, error: null };
};

// --- Add Item Logic ---
const openAddItemDialog = () => {
    newItem.value = { size: '', price: null };
    newItemError.value = null;
    isAddDialogVisible.value = true;
};

const confirmAddItem = () => {
    if (!newItem.value.size) {
        newItemError.value = "Size is required";
        return;
    }

    const result = processSizeInput(newItem.value.size); 
    if (result.error) {
        newItemError.value = result.error;
        return;
    }

    let newArray = [...props.modelValue, { 
        size: result.normalizedSize, 
        price: newItem.value.price || 0 
    }];

    newArray = sortPricingList(newArray);
    
    emit('update:modelValue', newArray);
    
    // Trigger Save with specific message. Dialog stays open until isSaving prop becomes false
    emitSave('New size added successfully.');
};

// --- Delete Item Logic ---
const openDeleteDialog = (index) => {
    itemToDeleteIndex.value = index;
    isDeleteDialogVisible.value = true;
};

const confirmDelete = () => {
    if (itemToDeleteIndex.value === null) return;

    const newArray = props.modelValue.filter((_, i) => i !== itemToDeleteIndex.value);
    emit('update:modelValue', newArray);
    
    // Trigger Save with specific message. Dialog stays open until isSaving prop becomes false
    emitSave('Size deleted successfully.');
};
</script>